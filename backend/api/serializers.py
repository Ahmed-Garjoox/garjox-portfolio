from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Profile, ProjectCategory, Project, ProjectImage, Research,
    Innovation, Category, Tag, Post, Skill, ContactMessage,
    Analytics, Setting
)

class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'profile']
        read_only_fields = ['id', 'is_staff', 'is_superuser']

    def get_profile(self, obj):
        try:
            profile = obj.profile
            return {
                'name': profile.name,
                'biography': profile.biography,
                'profile_image': profile.profile_image.url if profile.profile_image else None
            }
        except Profile.DoesNotExist:
            return None


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'username', 'email', 'name', 'biography', 
            'education', 'journey', 'goals', 'vision', 'cv', 'profile_image', 
            'created_at', 'updated_at'
        ]


class ProjectCategorySerializer(serializers.ModelSerializer):
    project_count = serializers.IntegerField(source='projects.count', read_only=True)

    class Meta:
        model = ProjectCategory
        fields = ['id', 'name', 'slug', 'project_count']


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'project', 'image', 'caption', 'created_at']


class ProjectSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'cover_image', 'technologies_used', 
            'category', 'category_name', 'category_slug', 'status', 'github_link', 
            'demo_link', 'documentation_url', 'case_study', 'is_featured', 
            'created_date', 'images', 'uploaded_images', 'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        project = Project.objects.create(**validated_data)
        for image in uploaded_images:
            ProjectImage.objects.create(project=project, image=image)
        return project

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        instance = super().update(instance, validated_data)
        for image in uploaded_images:
            ProjectImage.objects.create(project=instance, image=image)
        return instance


class ResearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Research
        fields = [
            'id', 'title', 'abstract', 'research_type', 'keywords', 
            'methodology', 'findings', 'pdf', 'publication_date', 
            'citation', 'created_at', 'updated_at'
        ]


class InnovationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Innovation
        fields = [
            'id', 'idea', 'problem', 'solution', 'prototype_url', 
            'impact', 'development_stage', 'future_plans', 
            'created_at', 'updated_at'
        ]


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(source='posts.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'post_count']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class PostSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    tags_details = TagSerializer(source='tags', many=True, read_only=True)
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'author_name', 'category', 'category_name', 'category_slug', 
            'tags', 'tags_details', 'title', 'content', 'status', 'featured_image', 
            'reading_time', 'published_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['author']

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.username


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'proficiency_percentage', 'category', 'created_at', 'updated_at']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'is_read', 'created_at']


class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analytics
        fields = ['id', 'page_path', 'ip_address', 'user_agent', 'referrer', 'timestamp']


class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = ['id', 'key', 'value', 'updated_at']
