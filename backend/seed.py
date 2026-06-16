import os
import django
import sys
from datetime import date, timedelta
from django.utils import timezone

# Setup Django Environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth.models import User
from api.models import (
    Profile, ProjectCategory, Project, Research, Innovation,
    Category, Tag, Post, Skill, Setting, ContactMessage, Analytics
)

def seed_data():
    print("Seeding database...")
    
    # 1. Create Superuser if not exists
    if not User.objects.filter(username="admin").exists():
        admin_user = User.objects.create_superuser("admin", "admin@example.com", "admin123")
        admin_user.first_name = "Ahmed"
        admin_user.last_name = "Mahamud"
        admin_user.save()
        print("Superuser 'admin' created with password 'admin123'.")
    else:
        admin_user = User.objects.get(username="admin")
        print("Superuser 'admin' already exists.")

    # 2. Update Profile details
    profile = admin_user.profile
    profile.name = "Ahmed Mahamud Ahmed"
    profile.biography = (
      "Experienced Database Administrator and Software Developer with a demonstrated history "
      "of designing robust data infrastructures, translating complex data models into functional software pipelines, "
      "and driving innovations in high-performance computing and complex systems."
    )
    profile.education = (
      "Bachelor of Science in Computer Science & Information Systems\n"
      "Master of Science in Database Systems"
    )
    profile.journey = (
      "Began as a software engineer focus on frontend applications before diving deep into backend development "
      "and SQL performance optimization. Over the last 5 years, expanded into engineering architectures for complex databases."
    )
    profile.goals = (
      "To engineer scalable database solutions, design analytical dashboards, "
      "and build open-source tools that solve accessibility challenges globally."
    )
    profile.vision = (
      "Bridge the gap between computer science theory and industrial database administration, "
      "creating seamless developer experiences through robust cloud structures."
    )
    profile.save()
    print("Profile updated.")

    # 3. Create Project Categories
    project_categories = [
        "Database", "Research", "Innovation", 
        "Web Development", "Mobile Apps", "AI Projects", "Academic Projects"
    ]
    cat_objs = {}
    for cat_name in project_categories:
        obj, created = ProjectCategory.objects.get_or_create(name=cat_name)
        cat_objs[cat_name] = obj
    print("Project categories created.")

    # 4. Create Skills
    skills_data = [
        # Database
        ("PostgreSQL", 95, "Database"),
        ("MySQL", 90, "Database"),
        ("SQL Server", 85, "Database"),
        # Development
        ("React", 90, "Development"),
        ("Django", 92, "Development"),
        ("JavaScript", 95, "Development"),
        ("Python", 93, "Development"),
        # Research
        ("Academic Research", 88, "Research"),
        ("Data Analysis", 85, "Research"),
        ("Technical Writing", 90, "Research"),
        # Leadership & Communication
        ("Problem Solving", 95, "Leadership"),
        ("Communication", 90, "Leadership"),
        ("Other", 80, "Other"),
    ]
    for name, percentage, category in skills_data:
        Skill.objects.get_or_create(name=name, defaults={"proficiency_percentage": percentage, "category": category})
    print("Skills created.")

    # 5. Create Projects
    projects_list = [
        {
            "title": "Enterprise SQL Tuner & Performance Monitor",
            "description": "An automated query performance analysis tool that hooks into PostgreSQL and SQL Server logs to suggest indexes and queries refactoring.",
            "category": cat_objs["Database"],
            "status": "Completed",
            "technologies_used": ["Python", "PostgreSQL", "SQL Server", "React"],
            "github_link": "https://github.com/ahmed/sql-tuner",
            "is_featured": True,
            "created_date": date.today() - timedelta(days=60),
            "case_study": "### Challenge\nDevelopers write complex SQL queries that lock rows and slow down API performance in high-traffic applications.\n\n### Solution\nWe created an engine using SQLParse and query explain plans to suggest optimized indexes and highlight problematic cross-joins.\n\n### Results\nSuccessfully reduced database lock-ups by 45% in production tests."
        },
        {
            "title": "Quantum Blockchain Consensus Innovation",
            "description": "A research prototype modeling the impact of quantum cryptography on standard distributed ledger algorithms.",
            "category": cat_objs["Innovation"],
            "status": "In Progress",
            "technologies_used": ["Python", "Django", "React"],
            "github_link": "https://github.com/ahmed/quantum-ledger",
            "is_featured": True,
            "created_date": date.today() - timedelta(days=30),
            "case_study": "Exploring quantum secure computing modules within server-client transactions."
        },
        {
            "title": "High-Throughput Analytics Dashboard",
            "description": "A dashboard designed to load millions of records using cursor pagination and dynamic caching via Django Rest Framework and Redis.",
            "category": cat_objs["Web Development"],
            "status": "Completed",
            "technologies_used": ["React", "Django", "PostgreSQL", "Redis"],
            "github_link": "https://github.com/ahmed/fast-dashboard",
            "is_featured": False,
            "created_date": date.today() - timedelta(days=90),
            "case_study": "Demonstrating lightning-fast loading of massive records."
        }
    ]
    for proj in projects_list:
        Project.objects.get_or_create(title=proj["title"], defaults=proj)
    print("Projects seeded.")

    # 6. Create Research Papers
    research_list = [
        {
            "title": "Optimizing Query Execution Plans on Distributed Postgre-clusters",
            "abstract": "This paper explores partitioning algorithms and index distribution to minimize latency in query planners on large multi-node database clusters.",
            "research_type": "Paper",
            "keywords": ["PostgreSQL", "Query Optimization", "Distributed Databases"],
            "methodology": "Simulated multi-node cluster with 10M rows. Applied horizontal sharding vs custom query router rules.",
            "findings": "Custom query routing based on indexing heuristics achieved 30% speedups over standard PostgreSQL query planner defaults.",
            "publication_date": date.today() - timedelta(days=120),
            "citation": "Ahmed, M. A. (2026). Journal of Database Engineering, 12(3), 145-159."
        },
        {
            "title": "A Novel Blockchain Consensus Protocol under Quantum Constraints",
            "abstract": "We present a mathematical model showing consensus stability when dealing with sub-atomic key rotations in quantum communication nodes.",
            "research_type": "Journal",
            "keywords": ["Quantum Security", "Consensus", "Distributed Systems"],
            "methodology": "Created mathematical models and simulated communication nodes with varying key rotation periods.",
            "findings": "The consensus maintains state consistency with up to 10% packet noise in quantum pathways.",
            "publication_date": date.today() - timedelta(days=45),
            "citation": "Ahmed, M. A. (2026). Quantum & Advanced Computing Letter, 8(1), 12-22."
        }
    ]
    for res in research_list:
        Research.objects.get_or_create(title=res["title"], defaults=res)
    print("Research records seeded.")

    # 7. Create Innovations
    innovations_list = [
        {
            "idea": "Self-Healing Database Connection Pooler",
            "problem": "Connection poolers fail to re-resolve database IP addresses when multi-node cloud clusters perform failovers, causing website downtime.",
            "solution": "Developed a custom Python script hook that intercepts socket errors, checks DNS health, and force-cycles pools instantly during primary node swaps.",
            "development_stage": "Prototype",
            "impact": "Reduced database failover recovery window from 3 minutes to less than 4 seconds.",
            "future_plans": "Package as a lightweight container overlay for Kubernetes configurations."
        },
        {
            "idea": "Dynamic API Query Translator",
            "problem": "Front-end developers spend too much time requesting API query filters for nested relations from backend engineers.",
            "solution": "A middleware parsing front-end JSON query parameters into optimized Django ORM filter expressions dynamically while enforcing security boundaries.",
            "development_stage": "Beta",
            "impact": "Boosted front-end development iterations by 60% with zero backend change requirements.",
            "future_plans": "Add AI-powered performance guards to automatically reject queries estimated to run over 100ms."
        }
    ]
    for inn in innovations_list:
        Innovation.objects.get_or_create(idea=inn["idea"], defaults=inn)
    print("Innovations seeded.")

    # 8. Create Blog Categories & Tags
    blog_categories = [
        "Technology", "Database", "Research", 
        "Innovation", "Education", "Society", "Personal Insights"
    ]
    blog_cat_objs = {}
    for name in blog_categories:
        obj, created = Category.objects.get_or_create(name=name)
        blog_cat_objs[name] = obj

    tags = ["PostgreSQL", "React", "Docker", "Algorithms", "Academic Life"]
    tag_objs = {}
    for tag_name in tags:
        obj, created = Tag.objects.get_or_create(name=tag_name)
        tag_objs[tag_name] = obj
    print("Blog categories and tags created.")

    # 9. Create Blog Posts
    posts_list = [
        {
            "title": "Why I Migrated My Main Projects to PostgreSQL",
            "content": "<p>PostgreSQL has proven itself to be one of the most stable, reliable open-source database engines in the world. From robust JSONB support to powerful transaction safety guarantees, it represents the gold standard for enterprise data storage.</p><h4>Advanced JSONB Indexing</h4><p>We can index JSON fields in PostgreSQL using GIN indexes. This provides the speed of NoSQL with the strict integrity of Relational Databases.</p>",
            "category": blog_cat_objs["Database"],
            "status": "Published",
            "reading_time": 4,
            "published_date": timezone.now() - timedelta(days=10),
        },
        {
            "title": "A Guide to Framer Motion Animations in React",
            "content": "<p>Visual design makes or breaks user retention. Using Framer Motion, we can add spring physics animations and exit transitions that feel extremely premium and professional rather than jerky browser defaults.</p>",
            "category": blog_cat_objs["Technology"],
            "status": "Published",
            "reading_time": 6,
            "published_date": timezone.now() - timedelta(days=5),
        }
    ]
    for idx, post in enumerate(posts_list):
        p_obj, created = Post.objects.get_or_create(
            title=post["title"],
            defaults={
                "author": admin_user,
                "category": post["category"],
                "content": post["content"],
                "status": post["status"],
                "reading_time": post["reading_time"],
                "published_date": post["published_date"],
            }
        )
        if created:
            p_obj.tags.add(tag_objs["PostgreSQL" if idx == 0 else "React"])
    print("Blog posts seeded.")

    # 10. Seed Analytics / Contact messages for charts
    ContactMessage.objects.get_or_create(
        name="Sarah Jenkins",
        email="sarah@example.com",
        subject="Collaboration on Query Tuner",
        message="Hi Ahmed, I read your research paper on distributed clusters and would love to test your query tuner tool on our staging databases. Let me know if you are open to a quick chat!"
    )
    ContactMessage.objects.get_or_create(
        name="David K.",
        email="david@example.org",
        subject="Job Opportunity - Senior DBA",
        message="Hello Ahmed, we are looking for a hybrid developer & DBA to lead our cloud database migration. Your portfolio looks amazing. Are you available for freelance consultations?"
    )

    # Seed some mock analytics logs over past 5 months
    now = timezone.now()
    paths = ['/', '/projects', '/research', '/blog', '/about', '/contact']
    for month_offset in range(5):
        log_date = now - timedelta(days=month_offset * 30)
        # Create 15-30 mock views per month
        for i in range(15 + (month_offset * 5)):
            Analytics.objects.create(
                page_path=paths[i % len(paths)],
                ip_address=f"192.168.1.{10 + i}",
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                timestamp=log_date - timedelta(days=i % 25, hours=i % 24)
            )

    print("Analytics and Contact Messages seeded.")
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_data()
