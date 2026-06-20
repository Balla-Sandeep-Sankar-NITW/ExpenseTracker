from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import extract


from app.database.db import get_db
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseResponse ,ExpenseResponseMessage


router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)


# add element ----------------

@router.post('/',response_model=ExpenseResponseMessage)
def create_expense(expence : ExpenseCreate ,db : Session = Depends(get_db)):
    try :
        item = Expense(**expence.model_dump())
        db.add(item)
        db.commit()
        db.refresh(item)
        return {
            "message": "Item added successfully",
            "data": item
        }
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )


# get elements ---------------

@router.get("/",response_model=list[ExpenseResponse])
def get_all_expense(db : Session = Depends(get_db)):
    try :
        expenses = db.query(Expense).all()
        return expenses
    
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

    

# ------ from date --------

# get by year
@router.get("/year/{y}",response_model=list[ExpenseResponse])
def get_expenses_by_year(y : int , db : Session = Depends(get_db)):
    try :
        return db.query(Expense).filter(extract('year',Expense.date) == y).all()
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

# get by month
@router.get("/month/{m}",)
def get_expenses_by_month(m : int , db : Session = Depends(get_db)):
    try :
        return db.query(Expense).filter(extract('month',Expense.date) == m).all()
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )
    
# get by day
@router.get("/day/{d}",response_model=list[ExpenseResponse])
def get_expenses_by_day(d : int , db : Session = Depends(get_db)):
    try :
        return db.query(Expense).filter(extract('day',Expense.date) == d).all()
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

# ------ from catergory --------

@router.get("/category/{cat}",response_model=list[ExpenseResponse])
def get_expenses_by_cat(cat : str , db : Session = Depends(get_db)):
    try :
        return db.query(Expense).filter(Expense.category == cat).all()
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )



# update elements ---------

@router.put('/update/{id}',response_model=ExpenseResponseMessage)
def update_an_record(id : int , new_expense : ExpenseCreate , db : Session = Depends(get_db)):
    try :
        item = db.query(Expense).filter(Expense.id == id).first()
        if item is None:
            raise HTTPException(
                status_code=404,
                detail="Expense not found"
            )
        for key, value in new_expense.model_dump().items():
            setattr(item, key, value)
        db.commit()
        db.refresh(item)
        return {
            "message": "Item updated successfully",
            "data": item
        }
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )


# delete elements -------------

@router.delete('/{id}',response_model=ExpenseResponseMessage)
def delete_record(id:int,db : Session = Depends(get_db)):
    try :
        item = db.query(Expense).filter(Expense.id == id).first()
        if item is None:
            raise HTTPException(
                status_code=404,
                detail="Expense not found"
            )
        db.delete(item)
        db.commit()
        return {
            "message": "Item deleted successfully",
            "data": item
        }
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )