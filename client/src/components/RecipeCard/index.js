import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './styles.css';

function RecipeCard(props) {
    var shortText = props.summary.substr(0, 200);
    var cleanText = shortText.replace(/<\/?[^>]+(>|$)/g, "") + "...";
    return (
        <Card key={props.key} className ="cardFull">
            <Card.Img variant="top" src={props.image} />
            <Card.Body>
                <Card.Title className="cardTitle">{props.title}</Card.Title>
                <Card.Text>
                    {cleanText}
                </Card.Text>
                <Link className="cardButton" to={{
                    pathname:'/Recipes',
                    state: {
                        recipeData: props
                    }
                }}>Check It Out</Link> 
                <p>Missing {props.missingIngredients.length} Ingredient(s)</p>
                
            </Card.Body>
        </Card>
    )
}

export default RecipeCard;