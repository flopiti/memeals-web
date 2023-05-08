import { motion } from 'framer-motion';
import styles from '../styles/ScheduledMealBox.module.css';
import Image from 'next/image'
import XButton from './Xbutton/Xbutton';
import { useState } from 'react';

const ScheduledMealBox = ({mealId, mealName, iconUrl, deleteMeal,scheduledMealId}: any) => {
    
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (event:any, index:number) => {
        setIsDragging(true);
        event.dataTransfer.setData('1', mealId);
        event.dataTransfer.setData('2', iconUrl);
        event.dataTransfer.setData('3', scheduledMealId);
      };

      const fadeIn = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
      };
    return(
        <div className={styles.containerMeal} 
        key={mealId}
        draggable
        onDragStart={()=>handleDragStart(event, mealId)}
        >                       
        <motion.div className={styles.buttonContainer}
        initial={fadeIn.initial}
        animate={fadeIn.animate}
        transition={{ duration: 2 }}
        >
                <XButton onClick={()=>deleteMeal(mealId)}>X</XButton>
        </motion.div>  
        <motion.div 
        className={styles.mealChoice}
        animate={{ backgroundColor: "#28afb0", scale: [0.25, 1] }}
        transition={{ duration: .5, type : "spring", stiffness: 200}}
        >
            <div>
                {mealName }
            </div>
            <motion.div
                className={styles.mealIcon}
                initial={{ y: 150 }}
                animate={{ y: [150,5], rotate: [0, 360]                          
                }
            }   transition={{delay:.25, duration: .5, stiffness: 100}}
            >
                {iconUrl ?  <Image src={iconUrl} alt="food" width={64} height={64} /> : <span></span>}
            </motion.div>
        </motion.div>
        </div>
    )
}

export default ScheduledMealBox;