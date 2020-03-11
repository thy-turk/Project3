import React, { Component } from 'react';
import API from "../../utils/API";
import { Button } from 'react-bootstrap';


class RecipeSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ingredients: [],
            strQuery: null
        }
        this.searchRecipes = this.searchRecipes.bind(this);
    }
    componentDidMount() {
        this.loadIngredients();
    }
    
    loadIngredients = () => {
        API.getIngredients()
            .then(res => {
                this.jsonConverter(res.data);
            })
            .catch(err => console.log(err));
    }

    searchRecipes() {
        API.searchRecipes({
            query: this.state.strQuery
        })
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
    }

    jsonConverter = json => {
        var array = [];
        json.map(ingredient => {
            array.push(ingredient.name);
        });
        this.pantryConcatenator(array);
    }
    pantryConcatenator = array => {
        let finalEl = array[array.length - 1];
        let pantryQuery = "";
        array.map(ingredient => {
            if (ingredient === finalEl) {
                pantryQuery += ingredient;
            } else {
                pantryQuery += ingredient + ",+";
            }
        });
        this.setState({ strQuery: pantryQuery });
    }
    render() {
        return (
            <Button variant="info" onClick={this.searchRecipes} style={{ margin: '10px' }}>Food Recipes</Button>
        )
    }
}

export default RecipeSearch;