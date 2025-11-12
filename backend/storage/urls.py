from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FileViewSet, PublicFileViewSet

router = DefaultRouter()
router.register(r'files', FileViewSet, basename='files')
router.register(r'public', PublicFileViewSet, basename='public')

urlpatterns = [
    path('', include(router.urls)),
]