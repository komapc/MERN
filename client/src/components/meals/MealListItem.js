import React from "react";
import { Link } from 'react-router-dom';


class MealListItem extends React.Component {
  render() {
    const meal = this.props.meal;
    return (
        <div className="meal_props">
          <img src={"http://www.catsinsinks.com/cats/rotator.php?" + meal._id} alt="Meal" className="meal_image"></img>
          <span className="mealName" > {meal.name}</span>
          <br />
          <span> { meal.created_at }</span>
          <br />
          <Link to={"/Attend/" + meal._id}> Attend</Link>
        </div>
    )
  };

}

export default MealListItem;
