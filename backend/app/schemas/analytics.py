from pydantic import BaseModel

class GroupExpenseItem(BaseModel):
    month: int | None = None
    day: int | None = None
    category: str | None = None
    total: float


class GroupExpensesResponse(BaseModel):
    message: str
    groupexpences: list[GroupExpenseItem]