import React, { useState } from "react";
import ModalX from "./ModalX";
import styles from "../styles/MealList.module.css";
import MealItem from "./MealItem";
export const Meals = ({
  likedMeals,
  meals,
  likeMeal,
  unlikeMeal,
  setLikedMeals,
  addMeal,
  removeMealFromList,
}: any) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [startIndex, setStartIndex] = useState<number>(0);
  const showModal = () => {
    setIsOpen(true);
  };

  const isMealLiked = (id: number) => {
    return likedMeals.some((likedMeal: { id: number }) => likedMeal.id === id);
  };

  const like = (id: number) => {
    setLikedMeals([
      ...likedMeals,
      meals.find((meal: { id: number }) => meal.id === id),
    ]);
    likeMeal(id);
  };

  const unlike = (id: number) => {
    setLikedMeals(
      likedMeals.filter((likedMeal: { id: number }) => likedMeal.id !== id),
    );
    unlikeMeal(id);
  };

  const handleDragStart = (event: any, id: number) => {
    event.dataTransfer.setData("1", id);
  };

  return (
    <div className={styles.mealList}>
      <h3 className={styles.subheader}>Browse new meals</h3>
      {meals
        .filter((meal: any) => !isMealLiked(meal.id))
        .slice(startIndex, startIndex + 7)
        .map((meal: any) => {
          const liked = isMealLiked(meal.id);
          return (
            <div
              key={meal.id}
              draggable
              onDragStart={() => handleDragStart(event, meal.id)}
            >
              <MealItem
                removeMealFromList={removeMealFromList}
                meal={meal}
                liked={liked}
                onLikeChange={() => (liked ? unlike(meal.id) : like(meal.id))}
              />
            </div>
          );
        })}
    </div>
  );
};
