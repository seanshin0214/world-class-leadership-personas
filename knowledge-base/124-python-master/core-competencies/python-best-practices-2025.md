# Python Best Practices 2025

**Updated**: 2025-11-23 | **Version**: Python 3.12+, FastAPI, Type Hints

---

## Modern Python Stack

```python
# pyproject.toml (PEP 518)
[project]
name = "my-project"
version = "1.0.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.110.0",
    "pydantic>=2.6.0",
    "sqlalchemy>=2.0.0",
    "httpx>=0.27.0"
]

[tool.ruff]
line-length = 100
select = ["E", "F", "I", "N", "UP"]

[tool.mypy]
python_version = "3.12"
strict = true
```

---

## Type Hints (PEP 484, 585, 604)

### Modern Syntax (Python 3.12)

```python
# Old (Python 3.9)
from typing import List, Dict, Optional, Union

def process(items: List[str]) -> Dict[str, int]:
    pass

# New (Python 3.10+)
def process(items: list[str]) -> dict[str, int]:
    pass

def get_user(id: int) -> User | None:  # Union types with |
    pass

# Generic types
from typing import TypeVar

T = TypeVar('T')

def first(items: list[T]) -> T | None:
    return items[0] if items else None
```

### Pydantic V2 Models

```python
from pydantic import BaseModel, Field, field_validator

class User(BaseModel):
    id: int
    username: str = Field(min_length=3, max_length=50)
    email: str
    age: int | None = None
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if '@' not in v:
            raise ValueError('Invalid email')
        return v.lower()

# Usage
user = User(id=1, username="john", email="JOHN@example.com")
print(user.email)  # "john@example.com"
print(user.model_dump_json())  # JSON string
```

---

## Async/Await Patterns

### FastAPI with Async

```python
from fastapi import FastAPI, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select

app = FastAPI()

DATABASE_URL = "postgresql+asyncpg://user:pass@localhost/db"
engine = create_async_engine(DATABASE_URL)

@app.get("/users/{user_id}")
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    async with db.begin():
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

# Multiple concurrent operations
import httpx

async def fetch_data():
    async with httpx.AsyncClient() as client:
        tasks = [
            client.get(f"https://api.example.com/user/{i}")
            for i in range(1, 11)
        ]
        responses = await asyncio.gather(*tasks)
    return [r.json() for r in responses]
```

### When to Use Async

```python
# ✓ Use async for:
- HTTP requests (httpx, aiohttp)
- Database queries (asyncpg, motor)
- File I/O (aiofiles)
- Concurrent tasks

# ✗ Don't use async for:
- CPU-bound tasks (use multiprocessing)
- Libraries without async support
- Simple scripts
```

---

## Data Classes & Protocols

### dataclass (PEP 557)

```python
from dataclasses import dataclass, field

@dataclass(frozen=True)  # Immutable
class Point:
    x: float
    y: float
    
    def distance(self) -> float:
        return (self.x ** 2 + self.y ** 2) ** 0.5

@dataclass
class User:
    id: int
    name: str
    emails: list[str] = field(default_factory=list)
    
    def __post_init__(self):
        self.name = self.name.title()
```

### Protocol (PEP 544) - Structural Subtyping

```python
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> None: ...

class Circle:
    def draw(self) -> None:
        print("Drawing circle")

class Square:
    def draw(self) -> None:
        print("Drawing square")

def render(shape: Drawable) -> None:
    shape.draw()

# Works without inheritance!
render(Circle())  # ✓
render(Square())  # ✓
```

---

## Error Handling

### Custom Exceptions

```python
class DataProcessingError(Exception):
    """Base exception for data processing"""
    pass

class ValidationError(DataProcessingError):
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

# Usage
try:
    if age < 0:
        raise ValidationError("age", "must be positive")
except ValidationError as e:
    logger.error(f"Validation failed: {e}")
```

### Context Managers

```python
from contextlib import contextmanager

@contextmanager
def database_transaction(db):
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

# Usage
with database_transaction(db) as session:
    session.add(user)
```

---

## Performance Optimization

### List Comprehensions vs Loops

```python
# Slow
result = []
for x in range(1000):
    if x % 2 == 0:
        result.append(x ** 2)

# Fast (2x faster)
result = [x ** 2 for x in range(1000) if x % 2 == 0]

# Generator (memory efficient)
result = (x ** 2 for x in range(1000000) if x % 2 == 0)
```

### functools.lru_cache

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 1000x faster for repeated calls
```

### Slots for Memory

```python
class Point:
    __slots__ = ['x', 'y']  # 40% less memory
    
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
```

---

## Testing (pytest)

### Fixtures

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Session = sessionmaker(bind=engine)
    session = Session()
    
    yield session
    
    session.close()

@pytest.fixture
def sample_user():
    return User(id=1, name="Test", email="test@example.com")

def test_user_creation(db_session, sample_user):
    db_session.add(sample_user)
    db_session.commit()
    
    user = db_session.query(User).first()
    assert user.name == "Test"
```

### Parametrize

```python
@pytest.mark.parametrize("input,expected", [
    ("hello", "HELLO"),
    ("world", "WORLD"),
    ("", ""),
])
def test_uppercase(input, expected):
    assert input.upper() == expected
```

### Async Tests

```python
@pytest.mark.asyncio
async def test_fetch_data():
    result = await fetch_user(user_id=1)
    assert result['name'] == "John"
```

---

## Project Structure

```
my_project/
├── src/
│   └── my_project/
│       ├── __init__.py
│       ├── api/
│       │   ├── __init__.py
│       │   └── routes.py
│       ├── models/
│       │   ├── __init__.py
│       │   └── user.py
│       ├── services/
│       │   └── user_service.py
│       └── utils/
│           └── helpers.py
├── tests/
│   ├── __init__.py
│   ├── test_api.py
│   └── test_services.py
├── pyproject.toml
├── README.md
└── .gitignore
```

---

## Tools

**Linting**: Ruff (replaces flake8, isort, pyupgrade)
**Formatting**: Black, Ruff format
**Type Checking**: mypy, pyright
**Testing**: pytest, hypothesis
**Coverage**: pytest-cov
**Dependency Management**: Poetry, uv (fast!)
**Package Build**: build, hatchling

---

## Code Quality Checklist

```markdown
□ Type hints on all functions
□ Docstrings (Google/NumPy style)
□ Tests (>80% coverage)
□ No mutable default arguments
□ Use pathlib instead of os.path
□ f-strings instead of .format()
□ Async for I/O-bound operations
□ List comprehensions for readability
□ Context managers for resources
□ Error handling with specific exceptions
```

---

## Common Pitfalls

### ❌ Mutable Default Arguments

```python
# Bad
def add_item(item, items=[]):
    items.append(item)
    return items

# Good
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

### ❌ Catching Broad Exceptions

```python
# Bad
try:
    result = process_data()
except:  # Catches everything, even KeyboardInterrupt!
    pass

# Good
try:
    result = process_data()
except (ValueError, TypeError) as e:
    logger.error(f"Processing failed: {e}")
    raise
```

---

## References

- Python 3.12 What's New
- FastAPI Documentation
- "Fluent Python" - Luciano Ramalho
- Real Python Tutorials

**Related**: `fastapi-advanced.md`, `async-programming.md`, `testing-pytest.md`
