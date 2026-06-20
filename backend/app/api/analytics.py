from fastapi import APIRouter , Depends , HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import extract , func
from datetime import datetime

from app.database.db import get_db
from app.models.expense import Expense
from app.schemas.analytics import GroupExpensesResponse

router = APIRouter(
    prefix='/analytics',
    tags=['Analytics']
)


@router.get('/monthly',response_model=GroupExpensesResponse)
def get_monthly_expences(db : Session = Depends(get_db)):
    try :
        items = (
            db.query(
                extract('month', Expense.date).label('month'),
                func.sum(Expense.amount).label('total')
            )
            .filter(extract('year', Expense.date) == datetime.now().year)
            .group_by(extract('month', Expense.date))
            .all()
        )

        items = [
            {"month": int(month), "total": float(total)}
            for month, total in items
        ]

        return {
            'message' : "Monthly Expences",
            'groupexpences' : items
        }
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

@router.get('/current-month/daily',response_model = GroupExpensesResponse)
def get_daily_expences(db : Session = Depends(get_db)):
    try :
        items = (
            db.query(
                extract('day', Expense.date).label('day'),
                func.sum(Expense.amount).label('total')
            )
            .filter(
                extract('month', Expense.date) == datetime.now().month,
                extract('year', Expense.date) == datetime.now().year
            )
            .group_by(extract('day', Expense.date))
            .order_by(extract('day', Expense.date))
            .all()
        )
        items = [
            {"day": int(day), "total": float(total)}
            for day, total in items
        ]
        return {
            'message' : "Daily Expences",
            'groupexpences' : items
        }
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

@router.get('/current-month/categories',response_model= GroupExpensesResponse)
def get_categorical_expences(db : Session = Depends(get_db)):
    try :
        items = (
            db.query(
                Expense.category.label('category'),
                func.sum(Expense.amount).label('total')
            )
            .filter(
                extract('month', Expense.date) == datetime.now().month,
                extract('year', Expense.date) == datetime.now().year
            )
            .group_by(Expense.category)
            .order_by(Expense.category)
            .all()
        )
        items = [
            {"category": str(category), "total": float(total)}
            for category , total in items
        ]
        return {
            'message' : "Categorical Expences",
            'groupexpences' : items
        }
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )