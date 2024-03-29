import { useIngredients } from "@/hooks/useIngredients";
import { Ingredient } from "@/types/Ingredient";
import { Meal } from "@/types/Meal";
import { MealIngredient } from "@/types/MealIngredient";
import { use, useEffect, useState } from "react";
import styles from "@/styles/MealForm.module.css";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useGPT } from "@/hooks/useGPT";

interface MealFormProps {
  meal: Meal | null;
  addMeal: ((meal: Meal) => Promise<void>) | null;
  editMeal: ((meal: Meal) => Promise<void>) | null;
  closeForm: () => void;
}

const MealForm = ({ meal, addMeal, editMeal, closeForm }: MealFormProps) => {
  const { getIngredients } = useIngredients();

  const [mealName, setMealName] = useState<string>(meal ? meal.mealName : "");
  const [iconUrl, setIconUrl] = useState<string>(meal ? meal.iconUrl : "");
  const [mealIngredients, setMealIngredients] = useState<MealIngredient[]>(
    meal ? meal.mealIngredients : [],
  );
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);

  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [selectedUnitOfMeasurement, setSelectedUnitOfMeasurement] =
    useState("g");

  const [mealNameError, setMealNameError] = useState(false);
  const [iconUrlError, setIconUrlError] = useState(false);
  const [ingredientError, setIngredientError] = useState(false);

  const { AskChat, isLoading } = useGPT();

  useEffect(() => {
    getIngredients().then((data: Ingredient[]) => setAllIngredients(data));
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (
        event.target instanceof HTMLInputElement &&
        event.target.id === "ingredientInput"
      ) {
        addIngredient();
        event.preventDefault();
      }
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const resetForm = () => {
    setMealName("");
    setIconUrl("");
    setMealIngredients([]);
    setMealNameError(false);
    setIconUrlError(false);
    setIngredientError(false);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    let formValid = true;
    if (!mealName.trim()) {
      setMealNameError(true);
      formValid = false;
    } else {
      setMealNameError(false);
    }

    if (iconUrl && !isValidUrl(iconUrl)) {
      setIconUrlError(true);
      formValid = false;
    } else {
      setIconUrlError(false);
    }

    if (formValid) {
      if (meal && editMeal) {
        editMeal({ id: meal.id, mealName, iconUrl, mealIngredients });
      } else if (addMeal) {
        addMeal({ id: null, mealName, iconUrl, mealIngredients });
      }
      closeForm();
      resetForm();
    }
  };

  const addIngredient = () => {
    if (!selectedIngredient) {
      setIngredientError(true);
      return;
    }
    setIngredientError(false);
    setMealIngredients([
      ...mealIngredients,
      {
        id: null,
        ingredientId: selectedIngredient.id,
        ingredientName: selectedIngredient.ingredientName,
        quantity: selectedQuantity,
        unitOfMeasurement: selectedUnitOfMeasurement,
      },
    ]);
    setSelectedIngredient(null);
    setSelectedQuantity(0);
    setSelectedUnitOfMeasurement("g");
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMealName(event.target.value);
  };

  const handleAsk = (mealName: string) => {
    const prompt = `Based on these typescript objects : 

        Meal = {
            mealName: string;
            mealIngredients: MealIngredient[];
        };
        MealIngredient {
            id: number | null;
            ingredientName: string;
            quantity: number;
            unitOfMeasurement: string;
        } 
        
        Please provide me with ONLY the the json for the meal : ${mealName} by creating a recipe
        of ingredient and quantities (mealIngredients). Make sure it's a valid json object.
        Make sure to leave the id to null for each mealIngredient.
        `;
    AskChat(prompt)
      .then((data: any) => {
        data = JSON.parse(data);
        const meal: Meal = data as Meal;

        setMealIngredients(meal.mealIngredients);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.box}>
      <form onSubmit={handleSubmit} className={styles.formBox}>
        <div className={styles.colRow}>
          <label>Meal Name:</label>
          <input type="text" value={mealName} onChange={handleNameChange} />
          <button type="button" onClick={() => handleAsk(mealName)}>
            Ask
          </button>
          {mealNameError && (
            <span style={{ color: "red" }}>Meal name is required</span>
          )}
        </div>

        {isLoading ? (
          <h2>loading...</h2>
        ) : (
          <div>
            <div className={styles.colRow}>
              <label>Icon Url:</label>
              <input
                type="text"
                value={iconUrl}
                onChange={(event) => setIconUrl(event.target.value)}
              />
              {iconUrlError && (
                <span style={{ color: "red" }}>
                  Please enter a valid URL for the icon
                </span>
              )}
            </div>
            <div className={styles.rowVert}>
              <label>Ingredients</label>
              <div className={styles.ingredientForm}>
                <input
                  className={styles.qtyStyle}
                  type="text"
                  id="quantity"
                  value={selectedQuantity}
                  onChange={(event) =>
                    setSelectedQuantity(Number(event.target.value))
                  }
                />
                <FormControl
                  fullWidth
                  variant="standard"
                  sx={{ marginBottom: 2, width: 50, display: "inline-block" }}
                >
                  <InputLabel id="unitOfMeasurement-label">
                    Unit of Measurement
                  </InputLabel>
                  <Select
                    sx={{ width: 50, display: "inline-block" }}
                    labelId="unitOfMeasurement-label"
                    id="unitOfMeasurement"
                    value={selectedUnitOfMeasurement}
                    label="Unit of Measurement"
                    onChange={(event) =>
                      setSelectedUnitOfMeasurement(event.target.value)
                    }
                  >
                    <MenuItem value="g">g</MenuItem>
                    <MenuItem value="ml">ml</MenuItem>
                    <MenuItem value="unit">unit</MenuItem>
                    <MenuItem value="tsp">tsp</MenuItem>
                    <MenuItem value="tbsp">tbsp</MenuItem>
                    <MenuItem value="cup">cup</MenuItem>
                    <MenuItem value="can">can</MenuItem>
                  </Select>
                </FormControl>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={allIngredients}
                  getOptionLabel={(option: any) => option.ingredientName}
                  sx={{ width: 250, display: "inline-block" }}
                  renderInput={(params) => (
                    <TextField {...params} label="ingredient" />
                  )}
                  value={selectedIngredient}
                  onChange={(_, value: any) => setSelectedIngredient(value)}
                  onKeyDown={handleKeyPress}
                />
              </div>
            </div>
            {ingredientError && (
              <span style={{ color: "red" }}>Please enter an ingredient</span>
            )}

            <button type="button" onClick={addIngredient}>
              Add Ingredient
            </button>
            <ul>
              {mealIngredients.map((ingredient: any, index: any) => (
                <li key={index} className={styles.ingredientItem}>
                  <span>
                    {ingredient.quantity} {ingredient.unitOfMeasurement}{" "}
                    {ingredient.ingredientName}
                  </span>
                  <button
                    type="button"
                    className={styles.removeIngredientButton}
                    onClick={() =>
                      setMealIngredients(
                        mealIngredients.filter((_, i) => i !== index),
                      )
                    }
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MealForm;
