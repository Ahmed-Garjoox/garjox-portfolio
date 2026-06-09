import os
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify

# Helper functions for file uploads
def get_cv_upload_path(instance, filename):
    return os.path.join('cvs', filename)

def get_profile_image_path(instance, filename):
    return os.path.join('profile', filename)

def get_project_image_path(instance, filename):
    return os.path.join('projects', filename)

def get_pdf_upload_path(instance, filename):
    return os.path.join('research', filename)

def get_blog_image_path(instance, filename):
    return os.path.join('blog', filename)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=200, default='Ahmed Mahamud Ahmed')
    biography = models.TextField(blank=True, null=True)
    education = models.TextField(blank=True, null=True)
    journey = models.TextField(blank=True, null=True)
    goals = models.TextField(blank=True, null=True)
    vision = models.TextField(blank=True, null=True)
    cv = models.FileField(upload_to=get_cv_upload_path, blank=True, null=True)
    profile_image = models.ImageField(upload_to=get_profile_image_path, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()


class ProjectCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    class Meta:
        verbose_name_plural = "Project Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Project(models.Model):
    STATUS_CHOICES = [
        ('Planned', 'Planned'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    cover_image = models.ImageField(upload_to=get_project_image_path, blank=True, null=True)
    technologies_used = models.JSONField(default=list)  # list of strings
    category = models.ForeignKey(ProjectCategory, on_delete=models.SET_NULL, null=True, related_name='projects')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='In Progress')
    github_link = models.URLField(blank=True, null=True)
    demo_link = models.URLField(blank=True, null=True)
    documentation_url = models.URLField(blank=True, null=True)
    case_study = models.TextField(blank=True, null=True)  # Markdown/rich content
    is_featured = models.BooleanField(default=False)
    created_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_date']

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=get_project_image_path)
    caption = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.project.title}"


class Research(models.Model):
    title = models.CharField(max_length=255)
    abstract = models.TextField()
    research_type = models.CharField(max_length=100)  # e.g., Paper, Journal, Patent
    keywords = models.JSONField(default=list)  # list of strings
    methodology = models.TextField(blank=True, null=True)
    findings = models.TextField(blank=True, null=True)
    pdf = models.FileField(upload_to=get_pdf_upload_path, blank=True, null=True)
    publication_date = models.DateField()
    citation = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Research Records"
        ordering = ['-publication_date']

    def __str__(self):
        return self.title


class Innovation(models.Model):
    STAGE_CHOICES = [
        ('Concept', 'Concept'),
        ('Prototype', 'Prototype'),
        ('Beta', 'Beta'),
        ('Production', 'Production'),
    ]

    idea = models.CharField(max_length=255)
    problem = models.TextField()
    solution = models.TextField()
    prototype_url = models.URLField(blank=True, null=True)
    impact = models.TextField(blank=True, null=True)
    development_stage = models.CharField(max_length=100, choices=STAGE_CHOICES, default='Concept')
    future_plans = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.idea


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    class Meta:
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Post(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Published', 'Published'),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='posts')
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')
    title = models.CharField(max_length=200)
    content = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Draft')
    featured_image = models.ImageField(upload_to=get_blog_image_path, blank=True, null=True)
    reading_time = models.IntegerField(default=5)  # in minutes
    published_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_date', '-created_at']

    def __str__(self):
        return self.title


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('Database', 'Database'),
        ('Development', 'Development'),
        ('Research', 'Research'),
        ('Leadership', 'Leadership'),
        ('Other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    proficiency_percentage = models.IntegerField()  # 0 to 100
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', '-proficiency_percentage']

    def __str__(self):
        return f"{self.name} ({self.proficiency_percentage}%)"


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"


class Analytics(models.Model):
    page_path = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    referrer = models.CharField(max_length=255, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Analytics Records"
        ordering = ['-timestamp']

    def __str__(self):
        return f"View of {self.page_path} at {self.timestamp}"


class Setting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.key
