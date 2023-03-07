import { useMeals } from "@/hooks/useMeals";
import { useEffect, useState } from "react";
import styles from '@/styles/Home.module.css'

export type Meal = {
    mealName: string,
    ingredients: string[]
  }

const MealList = ({meals}:any) => {

    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (event:any, index:number) => {
        setIsDragging(true);
        event.dataTransfer.setData('text/plain', meals[index].mealName);
      };
    
    return (
        <div className={styles.mealList}>
            {
                meals.map((meal:Meal, index:number) => {
                    return (
                    <span 
                    key={index}
                    draggable
                    onDragStart={()=>handleDragStart(event, index)}
                    className={styles.mealItem}>
                        {meal.mealName}
                    </span>)
                })
            }
        </div>
        );
    };

export default MealList;