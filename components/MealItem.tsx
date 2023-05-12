import React, { useState } from 'react';
import styles from '../styles/MealList.module.css';
import LikeAnimation from './LikeAnimation';
interface MealItemProps {
    meal: any;
    liked: boolean;
    onLikeChange: () => void;
    removeMealFromList:any;
}

const MealItem: React.FC<MealItemProps> = ({ meal, liked, onLikeChange , removeMealFromList}) => {
    const [showIngredients, setShowIngredients] = useState(false);

    const handleMouseEnter = () => {
        setShowIngredients(true);
    };

    const handleMouseLeave = () => {
        setShowIngredients(false);
    };

    return (
        <div>
            <li
            className={styles.mealItem}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {meal.mealName}
            {showIngredients && meal.mealIngredients.length > 0 && (
                <div className={styles.ingredientsBox}>
                    <ul>
                        {meal.mealIngredients?.map((ingredient: any, index: number) => 
                        <li key={index}>{ingredient.quantity}{ingredient.unitOfMeasurement} {ingredient.ingredientName}</li>)}
                    </ul>
                </div>
            )}
            </li>
            <LikeAnimation liked={liked} onLikeChange={onLikeChange}/>
        </div>
    );
};

export default MealItem;
