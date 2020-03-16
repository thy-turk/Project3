import React, { Component } from "react";
import DeleteBtn from "../components/DeleteBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import RecipeForm from "../components/RecipeForm"
import RecipeSlide from "../components/RecipeSlide"
class Recipes extends Component {
    state= {
        recipes: [],
        title: "",
        image: "",
        idAPI: "",
        ingredients: [],
        instructions: []
    }
    componentDidMount() {
        this.loadRecipes();        
    }

    loadRecipes = () => {
        API.getRecipes()
            .then(res=> this.setState({ recipes: res.data }))
            .catch(err=> console.log(err));     
    }
    deleteRecipe = id => {
        API.deleteRecipe(id)
          .then(res => window.location.reload(false))
          .catch(err => console.log(err));
    };
   
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
    };
    handleFormSubmit = event => {
        event.preventDefault();
        if (this.state.title && this.state.ingredients) {
            API.saveRecipe({
                title: this.state.title,
                image: this.state.image,
                ingredients: [this.state.ingredients],
                instructions: this.state.instructions
            })
            .then(res => window.location.reload(false))
            .catch(err => console.log(err));
        }
    }
    
    render() {
        return(
            <Container fluid>
                <Row>
                    <Col size="md-6">
                        <Jumbotron>
                            <h1>Recipes</h1>
                        </Jumbotron>
                        <RecipeForm
                        handleInputChange={this.handleInputChange}
                        handleFormSubmit={this.handleFormSubmit}
                        title={this.state.title}
                        image={this.state.image}
                        ingredients={this.state.ingredients}
                        instructions={this.state.instructions}
                        />
                       
                    </Col>
                    <Col size="md-6 sm-12">
                        <Jumbotron>
                        <h1>Recipe List</h1>
                        </Jumbotron>
                        {this.state.recipes.length ? (
                        <List>
                            {this.state.recipes.map(recipe => (
                            <ListItem key={recipe._id}>
                                <Link to={"/recipes/" + recipe._id}>
                                <strong>
                                    {recipe.title}
                                </strong>
                                </Link>
                                <DeleteBtn onClick={() => this.deleteRecipe(recipe._id)} />
                            </ListItem>
                            ))}
                        </List>
                        ) : (
                        <h3>No Results to Display</h3>
                        )}
                    </Col>
                </Row>
            </Container>
        )
    }

}

export default Recipes;