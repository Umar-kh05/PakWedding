from typing import Dict, Any, Optional
import logging
from datetime import datetime


class SingletonMeta(type):
    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class ApplicationConfig(metaclass=SingletonMeta):
    
    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._config: Dict[str, Any] = {}
            self._initialized = True
            self._created_at = datetime.utcnow()
    
    def set(self, key: str, value: Any):
        self._config[key] = value
    
    def get(self, key: str, default: Any = None) -> Any:
        return self._config.get(key, default)
    
    def get_all(self) -> Dict[str, Any]:
        return self._config.copy()
    
    def has(self, key: str) -> bool:
        return key in self._config
    
    def remove(self, key: str):
        if key in self._config:
            del self._config[key]
    
    def clear(self):
        self._config.clear()
    
    def __str__(self):
        return f"ApplicationConfig(keys={list(self._config.keys())}, created_at={self._created_at})"


class CacheManager(metaclass=SingletonMeta):
    
    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._cache: Dict[str, Any] = {}
            self._expiry: Dict[str, datetime] = {}
            self._initialized = True
            self.logger = logging.getLogger(__name__)
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        self._cache[key] = value
        if ttl:
            from datetime import timedelta
            self._expiry[key] = datetime.utcnow() + timedelta(seconds=ttl)
        self.logger.debug(f"Cache set: {key}")
    
    def get(self, key: str, default: Any = None) -> Any:
        if key in self._expiry:
            if datetime.utcnow() > self._expiry[key]:
                self.delete(key)
                self.logger.debug(f"Cache expired: {key}")
                return default
        
        value = self._cache.get(key, default)
        if value is not None:
            self.logger.debug(f"Cache hit: {key}")
        else:
            self.logger.debug(f"Cache miss: {key}")
        return value
    
    def delete(self, key: str):
        if key in self._cache:
            del self._cache[key]
        if key in self._expiry:
            del self._expiry[key]
        self.logger.debug(f"Cache deleted: {key}")
    
    def clear(self):
        self._cache.clear()
        self._expiry.clear()
        self.logger.info("Cache cleared")
    
    def has(self, key: str) -> bool:
        if key not in self._cache:
            return False
        
        if key in self._expiry:
            if datetime.utcnow() > self._expiry[key]:
                self.delete(key)
                return False
        
        return True
    
    def size(self) -> int:
        return len(self._cache)
    
    def keys(self) -> list:
        return list(self._cache.keys())


class RequestCounter(metaclass=SingletonMeta):
    
    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._counts: Dict[str, int] = {}
            self._timestamps: Dict[str, datetime] = {}
            self._initialized = True
    
    def increment(self, identifier: str):
        if identifier not in self._counts:
            self._counts[identifier] = 0
        self._counts[identifier] += 1
        self._timestamps[identifier] = datetime.utcnow()
    
    def get_count(self, identifier: str) -> int:
        return self._counts.get(identifier, 0)
    
    def reset(self, identifier: str):
        if identifier in self._counts:
            self._counts[identifier] = 0
    
    def reset_all(self):
        self._counts.clear()
        self._timestamps.clear()
    
    def get_all_counts(self) -> Dict[str, int]:
        return self._counts.copy()
    
    def get_last_timestamp(self, identifier: str) -> Optional[datetime]:
        return self._timestamps.get(identifier)


class MetricsCollector(metaclass=SingletonMeta):
    
    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._metrics: Dict[str, List[float]] = {}
            self._counters: Dict[str, int] = {}
            self._initialized = True
            self.logger = logging.getLogger(__name__)
    
    def record_metric(self, name: str, value: float):
        if name not in self._metrics:
            self._metrics[name] = []
        self._metrics[name].append(value)
        self.logger.debug(f"Metric recorded: {name}={value}")
    
    def increment_counter(self, name: str, amount: int = 1):
        if name not in self._counters:
            self._counters[name] = 0
        self._counters[name] += amount
        self.logger.debug(f"Counter incremented: {name}={self._counters[name]}")
    
    def get_metric_avg(self, name: str) -> Optional[float]:
        if name in self._metrics and self._metrics[name]:
            return sum(self._metrics[name]) / len(self._metrics[name])
        return None
    
    def get_metric_sum(self, name: str) -> float:
        if name in self._metrics:
            return sum(self._metrics[name])
        return 0.0
    
    def get_metric_count(self, name: str) -> int:
        if name in self._metrics:
            return len(self._metrics[name])
        return 0
    
    def get_counter(self, name: str) -> int:
        return self._counters.get(name, 0)
    
    def get_all_metrics(self) -> Dict[str, Any]:
        return {
            "metrics": {
                name: {
                    "count": len(values),
                    "avg": sum(values) / len(values) if values else 0,
                    "sum": sum(values),
                    "min": min(values) if values else 0,
                    "max": max(values) if values else 0
                }
                for name, values in self._metrics.items()
            },
            "counters": self._counters.copy()
        }
    
    def reset(self):
        self._metrics.clear()
        self._counters.clear()
        self.logger.info("Metrics reset")


def get_config() -> ApplicationConfig:
    return ApplicationConfig()


def get_cache() -> CacheManager:
    return CacheManager()


def get_request_counter() -> RequestCounter:
    return RequestCounter()


def get_metrics() -> MetricsCollector:
    return MetricsCollector()

