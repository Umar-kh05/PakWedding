"""
Singleton Pattern Implementation
Ensures a class has only one instance and provides a global point of access to it
Useful for configuration, logging, and database connections
"""
from typing import Dict, Any, Optional
import logging
from datetime import datetime


class SingletonMeta(type):
    """
    Metaclass for implementing Singleton pattern
    Thread-safe singleton implementation
    """
    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class ApplicationConfig(metaclass=SingletonMeta):
    """
    Application configuration singleton
    Ensures only one configuration instance exists throughout the application
    """
    
    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._config: Dict[str, Any] = {}
            self._initialized = True
            self._created_at = datetime.utcnow()
    
    def set(self, key: str, value: Any):
        """Set configuration value"""
        self._config[key] = value
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value"""
        return self._config.get(key, default)
    
    def get_all(self) -> Dict[str, Any]:
        """Get all configuration"""
        return self._config.copy()
    
    def has(self, key: str) -> bool:
        """Check if key exists"""
        return key in self._config
    
    def remove(self, key: str):
        """Remove configuration key"""
        if key in self._config:
            del self._config[key]
    
    def clear(self):
        """Clear all configuration"""
        self._config.clear()
    
    def __str__(self):
        return f"ApplicationConfig(keys={list(self._config.keys())}, created_at={self._created_at})"


class CacheManager(metaclass=SingletonMeta):
    """
    Cache manager singleton
    Provides in-memory caching across the application
    """
    
    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._cache: Dict[str, Any] = {}
            self._expiry: Dict[str, datetime] = {}
            self._initialized = True
            self.logger = logging.getLogger(__name__)
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        """
        Set cache value
        ttl: Time to live in seconds
        """
        self._cache[key] = value
        if ttl:
            from datetime import timedelta
            self._expiry[key] = datetime.utcnow() + timedelta(seconds=ttl)
        self.logger.debug(f"Cache set: {key}")
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get cache value"""
        # Check if expired
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
        """Delete cache entry"""
        if key in self._cache:
            del self._cache[key]
        if key in self._expiry:
            del self._expiry[key]
        self.logger.debug(f"Cache deleted: {key}")
    
    def clear(self):
        """Clear all cache"""
        self._cache.clear()
        self._expiry.clear()
        self.logger.info("Cache cleared")
    
    def has(self, key: str) -> bool:
        """Check if key exists and is not expired"""
        if key not in self._cache:
            return False
        
        # Check expiry
        if key in self._expiry:
            if datetime.utcnow() > self._expiry[key]:
                self.delete(key)
                return False
        
        return True
    
    def size(self) -> int:
        """Get number of cached items"""
        return len(self._cache)
    
    def keys(self) -> list:
        """Get all cache keys"""
        return list(self._cache.keys())


class RequestCounter(metaclass=SingletonMeta):
    """
    Request counter singleton
    Tracks API request counts for rate limiting and analytics
    """
    
    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._counts: Dict[str, int] = {}
            self._timestamps: Dict[str, datetime] = {}
            self._initialized = True
    
    def increment(self, identifier: str):
        """Increment counter for identifier"""
        if identifier not in self._counts:
            self._counts[identifier] = 0
        self._counts[identifier] += 1
        self._timestamps[identifier] = datetime.utcnow()
    
    def get_count(self, identifier: str) -> int:
        """Get count for identifier"""
        return self._counts.get(identifier, 0)
    
    def reset(self, identifier: str):
        """Reset counter for identifier"""
        if identifier in self._counts:
            self._counts[identifier] = 0
    
    def reset_all(self):
        """Reset all counters"""
        self._counts.clear()
        self._timestamps.clear()
    
    def get_all_counts(self) -> Dict[str, int]:
        """Get all counts"""
        return self._counts.copy()
    
    def get_last_timestamp(self, identifier: str) -> Optional[datetime]:
        """Get last timestamp for identifier"""
        return self._timestamps.get(identifier)


class MetricsCollector(metaclass=SingletonMeta):
    """
    Metrics collector singleton
    Collects application metrics and statistics
    """
    
    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._metrics: Dict[str, List[float]] = {}
            self._counters: Dict[str, int] = {}
            self._initialized = True
            self.logger = logging.getLogger(__name__)
    
    def record_metric(self, name: str, value: float):
        """Record a metric value"""
        if name not in self._metrics:
            self._metrics[name] = []
        self._metrics[name].append(value)
        self.logger.debug(f"Metric recorded: {name}={value}")
    
    def increment_counter(self, name: str, amount: int = 1):
        """Increment a counter"""
        if name not in self._counters:
            self._counters[name] = 0
        self._counters[name] += amount
        self.logger.debug(f"Counter incremented: {name}={self._counters[name]}")
    
    def get_metric_avg(self, name: str) -> Optional[float]:
        """Get average of a metric"""
        if name in self._metrics and self._metrics[name]:
            return sum(self._metrics[name]) / len(self._metrics[name])
        return None
    
    def get_metric_sum(self, name: str) -> float:
        """Get sum of a metric"""
        if name in self._metrics:
            return sum(self._metrics[name])
        return 0.0
    
    def get_metric_count(self, name: str) -> int:
        """Get count of metric values"""
        if name in self._metrics:
            return len(self._metrics[name])
        return 0
    
    def get_counter(self, name: str) -> int:
        """Get counter value"""
        return self._counters.get(name, 0)
    
    def get_all_metrics(self) -> Dict[str, Any]:
        """Get all metrics summary"""
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
        """Reset all metrics"""
        self._metrics.clear()
        self._counters.clear()
        self.logger.info("Metrics reset")


# Convenience functions for accessing singletons
def get_config() -> ApplicationConfig:
    """Get application config instance"""
    return ApplicationConfig()


def get_cache() -> CacheManager:
    """Get cache manager instance"""
    return CacheManager()


def get_request_counter() -> RequestCounter:
    """Get request counter instance"""
    return RequestCounter()


def get_metrics() -> MetricsCollector:
    """Get metrics collector instance"""
    return MetricsCollector()

