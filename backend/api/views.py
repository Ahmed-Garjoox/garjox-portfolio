from rest_framework import viewsets, permissions, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta

from .models import (
    Profile, ProjectCategory, Project, ProjectImage, Research,
    Innovation, Category, Tag, Post, Skill, ContactMessage,
    Analytics, Setting
)
from .serializers import (
    ProfileSerializer, ProjectCategorySerializer, ProjectSerializer,
    ProjectImageSerializer, ResearchSerializer, InnovationSerializer,
    CategorySerializer, TagSerializer, PostSerializer, SkillSerializer,
    ContactMessageSerializer, AnalyticsSerializer, SettingSerializer,
    UserSerializer
)

# Custom Permissions
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class IsSuperAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_superuser


# ViewSets
class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        # Allow filtering for the owner profile (should be only one profile generally)
        return Profile.objects.all()


class ProjectCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProjectCategory.objects.all()
    serializer_class = ProjectCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None # Return all categories without pagination


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Project.objects.all().prefetch_related('images')
        
        # Public users see only completed/published (or we show all based on admin config, let's show all by default but filter by query params)
        category = self.request.query_params.get('category', None)
        is_featured = self.request.query_params.get('is_featured', None)
        search = self.request.query_params.get('search', None)
        status_filter = self.request.query_params.get('status', None)

        if category:
            queryset = queryset.filter(Q(category__slug=category) | Q(category__id=category))
        if is_featured:
            queryset = queryset.filter(is_featured=(is_featured.lower() == 'true'))
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search) | 
                Q(technologies_used__icontains=search)
            )
        
        # Sorting
        sort_by = self.request.query_params.get('ordering', '-created_date')
        return queryset.order_by(sort_by)


class ProjectImageViewSet(viewsets.ModelViewSet):
    queryset = ProjectImage.objects.all()
    serializer_class = ProjectImageSerializer
    permission_classes = [IsAdminOrReadOnly]


class ResearchViewSet(viewsets.ModelViewSet):
    queryset = Research.objects.all()
    serializer_class = ResearchSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Research.objects.all()
        
        search = self.request.query_params.get('search', None)
        research_type = self.request.query_params.get('type', None)
        year = self.request.query_params.get('year', None)

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(abstract__icontains=search) | 
                Q(keywords__icontains=search) |
                Q(findings__icontains=search)
            )
        if research_type:
            queryset = queryset.filter(research_type__iexact=research_type)
        if year:
            queryset = queryset.filter(publication_date__year=year)

        return queryset


class InnovationViewSet(viewsets.ModelViewSet):
    queryset = Innovation.objects.all()
    serializer_class = InnovationSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Innovation.objects.all()
        stage = self.request.query_params.get('stage', None)
        if stage:
            queryset = queryset.filter(development_stage__iexact=stage)
        return queryset


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAdminOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        queryset = Post.objects.all()
        
        # If user is not admin, hide drafts
        if not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(status='Published')
        else:
            status_param = self.request.query_params.get('status', None)
            if status_param:
                queryset = queryset.filter(status=status_param)

        category = self.request.query_params.get('category', None)
        tag = self.request.query_params.get('tag', None)
        search = self.request.query_params.get('search', None)

        if category:
            queryset = queryset.filter(Q(category__slug=category) | Q(category__id=category))
        if tag:
            queryset = queryset.filter(Q(tags__slug=tag) | Q(tags__id=tag))
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(content__icontains=search)
            )

        return queryset.distinct()


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None

    def get_queryset(self):
        queryset = Skill.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__iexact=category)
        return queryset


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]


class AnalyticsViewSet(viewsets.ModelViewSet):
    queryset = Analytics.objects.all()
    serializer_class = AnalyticsSerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # Resolve client IP address helper
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        
        user_agent = self.request.META.get('HTTP_USER_AGENT', '')
        referrer = self.request.META.get('HTTP_REFERER', '')
        serializer.save(ip_address=ip, user_agent=user_agent, referrer=referrer)


class SettingViewSet(viewsets.ModelViewSet):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Totals
        total_projects = Project.objects.count()
        total_articles = Post.objects.count()
        total_research = Research.objects.count()
        total_innovations = Innovation.objects.count()
        total_messages = ContactMessage.objects.count()
        total_visitors = Analytics.objects.values('ip_address').distinct().count()

        # Group page views by month (last 6 months)
        six_months_ago = timezone.now() - timedelta(days=180)
        views_by_month = (
            Analytics.objects.filter(timestamp__gte=six_months_ago)
            .annotate(month=TruncMonth('timestamp'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )
        
        monthly_views_data = []
        for v in views_by_month:
            if v['month']:
                monthly_views_data.append({
                    'name': v['month'].strftime('%b %Y'),
                    'views': v['count']
                })

        # Projects by category
        projects_by_cat = (
            Project.objects.values('category__name')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        
        projects_category_data = []
        for item in projects_by_cat:
            cat_name = item['category__name'] or 'Uncategorized'
            projects_category_data.append({
                'name': cat_name,
                'value': item['count']
            })

        # Articles by category
        articles_by_cat = (
            Post.objects.values('category__name')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        
        articles_category_data = []
        for item in articles_by_cat:
            cat_name = item['category__name'] or 'Uncategorized'
            articles_category_data.append({
                'name': cat_name,
                'value': item['count']
            })

        # Latest contact messages (limit 5)
        latest_messages = ContactMessage.objects.all()[:5]
        messages_serializer = ContactMessageSerializer(latest_messages, many=True)

        return Response({
            'totals': {
                'projects': total_projects,
                'articles': total_articles,
                'research': total_research,
                'innovations': total_innovations,
                'messages': total_messages,
                'visitors': total_visitors,
            },
            'monthlyViews': monthly_views_data,
            'projectsByCategory': projects_category_data,
            'articlesByCategory': articles_category_data,
            'recentMessages': messages_serializer.data
        })
