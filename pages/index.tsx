import Head from 'next/head'
import Calendar from '@/components/Calendar'
import MealList from '@/components/MealList'
import { useEffect, useState } from 'react'
import { useScheduledMeals } from '@/hooks/useScheduledMeals'
import { useMeals } from '@/hooks/useMeals'
import { Meal } from '@/components/ScheduledMeal'
import { GetServerSidePropsContext } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function Home() {
  const { getScheduledMeals } = useScheduledMeals();
  const { getMeals } = useMeals();
  const[scheduledMeals, setScheduledMeals] = useState<ScheduledMeal[]>([]);
  const[meals, setMeals] = useState<Meal[]>([]);

  const scheduleMeal = async ({id, date, mealType,mealId, mealName, iconUrl, meal2Name, icon2Url }: ScheduledMeal) => {
    setScheduledMeals([...scheduledMeals, {id, date, mealType,mealId, mealName, iconUrl, meal2Name, icon2Url }])
  }
  const removeMeal = async (id:number) => {
    setScheduledMeals(scheduledMeals.filter((meal:any) => meal.id !== id))
  }
  const addMealToScheduledMeal = async ({id, date, mealType, mealId, mealName, iconUrl, meal2Name, icon2Url}: ScheduledMeal) => {
    setScheduledMeals([...scheduledMeals.filter((meal:any) => meal.date !== date || meal.mealType !== mealType || meal.mealName !== mealName), {id, date, mealType, mealId, mealName, iconUrl, meal2Name, icon2Url } ])
  }
  const addMeal = async (meal:Meal) => {
    setMeals([...meals, meal])
  }

  useEffect(() => {
    getMeals().then((data:any) => setMeals(data))
    getScheduledMeals().then((data:any) =>  setScheduledMeals(data));
  }, [])  

  return (
    <>
      <Head>
        <title>MeMeals</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/memeals.png" />
      </Head>
      <a href="/api/auth/logout">Logout</a>
      <Calendar scheduledMeals={scheduledMeals} scheduleMeal={scheduleMeal} removeMeal={removeMeal} addMealToScheduledMeal={addMealToScheduledMeal}/>
      <MealList meals={meals} addMeal={addMeal}/>
    </>
  )
}

export type ScheduledMeal = {
  id: number;
  date: string;
  mealType: string;
  mealId: number;
  mealName: string;
  iconUrl: string;
  meal2Name: string;
  icon2Url: string;
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ({ locale }: GetServerSidePropsContext) => {
    return {
      props: {
        ...(await serverSideTranslations(locale || 'en', ['common'])),
      },
    };
  },
});
