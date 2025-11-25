"""
Service routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from app.repositories.service_repository import ServiceRepository
from app.api.dependencies import get_service_repository, get_current_vendor
from app.models.service import ServiceCreate, ServiceUpdate, ServiceResponse

router = APIRouter()


@router.post("/", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    service_data: ServiceCreate,
    current_user: dict = Depends(get_current_vendor),
    service_repo: ServiceRepository = Depends(get_service_repository)
):
    """Create a new service (vendor only)"""
    service_dict = service_data.model_dump()
    service = await service_repo.create(service_dict)
    return service


@router.get("/", response_model=List[ServiceResponse])
async def get_services(
    category: str = Query(None),
    vendor_id: str = Query(None),
    skip: int = 0,
    limit: int = 100,
    service_repo: ServiceRepository = Depends(get_service_repository)
):
    """Get services, optionally filtered by category or vendor"""
    if vendor_id:
        services = await service_repo.get_by_vendor_id(vendor_id, skip, limit)
    elif category:
        services = await service_repo.get_by_category(category, skip, limit)
    else:
        services = await service_repo.get_all(skip, limit)
    return services


@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service(
    service_id: str,
    service_repo: ServiceRepository = Depends(get_service_repository)
):
    """Get service by ID"""
    service = await service_repo.get_by_id(service_id)
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    return service

