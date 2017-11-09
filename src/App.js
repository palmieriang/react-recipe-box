import React, {Component} from 'react'
import './App.css'
import Accordion from 'react-bootstrap/lib/Accordion'
import Panel from 'react-bootstrap/lib/Panel'
import Button from 'react-bootstrap/lib/Button'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import Modal from 'react-bootstrap/lib/Modal'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import FormControl from 'react-bootstrap/lib/FormControl'
import uuidv4 from 'uuid/v4'

class App extends Component {
  constructor () {
    super();
    this.state = {
      recipes: [
        {
          id: uuidv4(),
          recipeName: 'Carbonara',
          img: 'https://images.unsplash.com/photo-1499937089231-219080cdf888?auto=format&fit=crop&w=1600&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D',
          ingredients: '3 large free-range egg yolks, 40 g Parmesan cheese, 150 g pancetta, 1 clove of garlic',
          method: 'test',
          error: ''
        },
        {
          id: uuidv4(),
          recipeName: 'Lemon & Lobster Risotto',
          img: 'https://images.unsplash.com/photo-1461009683693-342af2f2d6ce?auto=format&fit=crop&w=4031&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D',
          ingredients: '2 lobster tails, 1 shallot finely chopped, 2 lemons, 4 cups of chicken or vegetable stock',
          method: 'test',
          error: ''
        },
        {
          id: uuidv4(),
          recipeName: 'Tagliatelle Mushroom',
          img: '',
          ingredients: '10 chestnut mushrooms, finely sliced, 200g fresh spinach, 200ml crème fraîche',
          method: 'test',
          error: ''
        }
      ],
      currentRecipeId: null,
      modalVisible: false,
      // newRecipe: {recipeName: '', img: '', ingredients: [], method: ''},
      currentRecipe: {recipeName: '', img: '', ingredients: '', method: ''}
    }
  }

  componentDidMount () {
    let recipes = JSON.parse(localStorage.getItem('recipes')) || this.state.recipes
    this.setState({recipes})
    // this.callApi()
  }

  callApi () {
    fetch('./recipes.json')
      .then(response => response.json())
      .then(json => {
        this.setState({recipes: json});
      })
  }

  onChange = event => {
    const {recipes, currentRecipeId, currentRecipe} = this.state

    this.setState({
      currentRecipe: {
        ...currentRecipe,
        [event.target.name]: event.target.value
      }
    })
  }

  deleteRecipe (index) {
    const recipes = this.state.recipes.slice()
    recipes.splice(index, 1)
    this.setState({recipes})
  }

  // updateNewRecipe (name, image, ingredients, method) {
  //   this.setState({newRecipe: {recipeName: name, img: image, ingredients: ingredients, method: method}})
  // }

  validate (recipe) {
    let valid = true
    this.setState({
      error: ''
    })
    if (recipe.ingredients.length < 1) {
      valid = false
      this.setState({
        error: 'Please enter ingredients'
      })
    }
    if (recipe.recipeName.length < 2) {
      valid = false
      this.setState({
        error: 'Please enter a valid name'
      })
    }
    return valid
  }

  onSubmit = id => {
    const {currentRecipe, recipes} = this.state
    const existingRecipe = recipes.find(recipe => recipe.id === id)

    if (existingRecipe) {
      debugger
      const recipes = this.state.recipes.map(recipe => {
        if(recipe.id === currentRecipe.id) {
          return currentRecipe
        }
        return recipe
      })
      this.setState({recipes})
    } else {
      debugger
      this.setState({
        recipes: [
          ...recipes,
          currentRecipe
        ]
      })
    }
    debugger
    this.setState({
      currentRecipe: {recipeName: '', img: '', ingredients: '', method: ''}
    })
    this.close()
  }

  open = id => {
    const {recipes} = this.state
    const existingRecipe = recipes.find(recipe => recipe.id === id)

    if (!existingRecipe) {
      return this.setState({
        modalVisible: true,
        currentRecipeId: id,
        currentRecipe: {recipeName: '', img: '', ingredients: '', method: ''}
      })
    }

    this.setState({
      modalVisible: true,
      currentRecipeId: id,
      currentRecipe: existingRecipe
    })
  }

  close = () => {
    this.setState({modalVisible: false, currentRecipeId: null})
  }

  render () {
    const {recipes, currentRecipeId, modalVisible, currentRecipe} = this.state

    return (
      <div>
        <div className="header">
          <div className="header-text">
            <h1>Recipe Box</h1>
          </div>
        </div>
        <div className="container">
          {recipes.length > 0 && (
            <div>
              <Accordion>
                {recipes.map((recipe, index) => (
                  <Panel className="recipe-box" header={
                    <div className="recipe-header">
                      {recipe.img && <div className="recipe-image">
                        <img src={recipe.img} alt={recipe.recipeName} width="100%"/>
                      </div>}
                      <h2 className="recipe-name">{recipe.recipeName}</h2>
                    </div>
                  } eventKey={index} key={index}>
                    <div className="recipe-body">
                      <div className="recipe-ingredients">
                        <h3>Ingredients</h3>
                        <ul>
                          {recipe.ingredients.split(',').map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="recipe-method">
                        <h3>Method</h3>
                        <p>{recipe.method}</p>
                      </div>
                    </div>
                    <ButtonToolbar className="recipe-btn">
                      <Button bsStyle="default" onClick={() => this.open(recipe.id)}>Edit Recipe</Button>
                      <Button bsStyle="danger" onClick={() => this.deleteRecipe(index)}>Delete Recipe</Button>
                    </ButtonToolbar>
                  </Panel>
                ))}
              </Accordion>

              {currentRecipe && <Modal show={modalVisible} onHide={this.close}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Recipe</Modal.Title>
                  <Modal.Body>
                    <FormGroup controlId="formBasicText">
                      <ControlLabel>Recipe Name</ControlLabel>
                      <FormControl
                        type="text"
                        name="recipeName"
                        value={currentRecipe.recipeName}
                        placeholder="Enter Text"
                        onChange={this.onChange}>
                      </FormControl>
                    </FormGroup>
                    <FormGroup controlId="formControlTextarea">
                      <ControlLabel>Ingredients</ControlLabel>
                      <FormControl
                        componentClass="textarea"
                        name="ingredients"
                        value={currentRecipe.ingredients}
                        placeholder="Enter Ingredients (separate by commas)"
                        onChange={this.onChange}>
                      </FormControl>
                    </FormGroup>
                    <FormGroup controlId="formControlTextarea">
                      <ControlLabel>Method</ControlLabel>
                      <FormControl
                        componentClass="textarea"
                        name="method"
                        value={currentRecipe.method}
                        placeholder="Method"
                        onChange={this.onChange}>
                      </FormControl>
                    </FormGroup>
                    <FormGroup controlId="formControlTextarea">
                      <ControlLabel>Recipe Image URL</ControlLabel>
                      <FormControl
                        componentClass="textarea"
                        name="img"
                        value={currentRecipe.img}
                        placeholder="Enter images URL"
                        onChange={this.onChange}>
                      </FormControl>
                    </FormGroup>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                    <Button onClick={() => this.onSubmit(currentRecipeId)}>Save Recipe</Button>
                  </Modal.Footer>
                </Modal.Header>
              </Modal>
              }
            </div>
          )}
          <Button bsStyle="primary" onClick={() => this.open(uuidv4())}>Add Recipe</Button>
        </div>
      </div>
    )
  }
}

export default App
