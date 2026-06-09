from django.contrib import admin
from .models import (
    Profile, ProjectCategory, Project, ProjectImage, Research,
    Innovation, Category, Tag, Post, Skill, ContactMessage,
    Analytics, Setting
)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at')
    search_fields = ('name', 'user__username', 'biography')


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'is_featured', 'created_date')
    list_filter = ('status', 'is_featured', 'category')
    search_fields = ('title', 'description', 'technologies_used')
    inlines = [ProjectImageInline]


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ('project', 'image', 'caption')
    list_filter = ('project',)


@admin.register(Research)
class ResearchAdmin(admin.ModelAdmin):
    list_display = ('title', 'research_type', 'publication_date')
    list_filter = ('research_type',)
    search_fields = ('title', 'abstract', 'keywords')


@admin.register(Innovation)
class InnovationAdmin(admin.ModelAdmin):
    list_display = ('idea', 'development_stage', 'created_at')
    list_filter = ('development_stage',)
    search_fields = ('idea', 'problem', 'solution')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'status', 'published_date')
    list_filter = ('status', 'category')
    search_fields = ('title', 'content')
    raw_id_fields = ('author',)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'proficiency_percentage', 'category')
    list_filter = ('category',)
    search_fields = ('name',)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('subject', 'name', 'email', 'is_read', 'created_at')
    list_filter = ('is_read',)
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',)


@admin.register(Analytics)
class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ('page_path', 'ip_address', 'timestamp')
    list_filter = ('timestamp',)
    search_fields = ('page_path', 'ip_address')
    readonly_fields = ('timestamp',)


@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', 'updated_at')
    search_fields = ('key',)
