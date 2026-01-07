from typing import Optional
from sqlmodel import Field, SQLModel


class TodoBase(SQLModel):
    title: str
    description: str
    is_completed: bool = False


class Todo(TodoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class TodoCreate(TodoBase):
    pass


class TodoUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
