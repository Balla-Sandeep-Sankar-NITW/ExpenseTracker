from pydantic import BaseModel
from datetime import date
from typing import Optional

class ExpenseCreate(BaseModel):
    amount: float
    category: str
    date: date
    description: Optional[str] = None


class ExpenseResponse(BaseModel):
    id : int
    amount : float
    category : str
    date : date
    description : Optional[str]


class ExpenseResponseMessage(BaseModel):
    message: str
    data: ExpenseResponse