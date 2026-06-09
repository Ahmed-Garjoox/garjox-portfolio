from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    CurrentUserView, ProfileViewSet, ProjectCategoryViewSet, ProjectViewSet,
    ProjectImageViewSet, ResearchViewSet, InnovationViewSet, CategoryViewSet,
    TagViewSet, PostViewSet, SkillViewSet, ContactMessageViewSet,
    AnalyticsViewSet, SettingViewSet, DashboardStatsView
)

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'project-categories', ProjectCategoryViewSet, basename='project-category')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'project-images', ProjectImageViewSet, basename='project-image')
router.register(r'research', ResearchViewSet, basename='research')
router.register(r'innovations', InnovationViewSet, basename='innovation')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'messages', ContactMessageViewSet, basename='message')
router.register(r'analytics-log', AnalyticsViewSet, basename='analytics')
router.register(r'settings', SettingViewSet, basename='settings')

urlpatterns = [
    # Router views
    path('', include(router.urls)),
    
    # Auth endpoints
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/me/', CurrentUserView.as_view(), name='current_user'),
    
    # Custom dashboard stats
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
]
