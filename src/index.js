import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      recipes: [
        {
          id: 1,
          name: "cake",
          ingredients: "milk, eggs, flour",
          show: false
        },
        {
          id: 2,
          name: "chili mac",
          ingredients: "chili, mac n cheese",
          show: false
        }
      ],
      isModalActive: false,
      modalItemId: null,
      modalType: null
    };
    this.modalControl = this.modalControl.bind(this);
    this.showIngredients = this.showIngredients.bind(this);
    this.saveEditToState = this.saveEditToState.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }

  showIngredients(id) {
    console.log(id);
    let newRecipesList = this.state.recipes;
    let target = this.state.recipes.filter(entry => entry.id === id)[0];
    target.show === false ? (target.show = true) : (target.show = false);
    let idx = this.state.recipes.map(val => val.id).indexOf(id);
    newRecipesList[idx] = target;
    this.setState(Object.assign({}, this.state, { recipes: newRecipesList }));
  }

  modalControl(id) {
    let modalState;
    this.state.isModalActive ? (modalState = false) : (modalState = true);
    this.setState(
      Object.assign({}, this.state, {
        isModalActive: modalState,
        modalItemId: id
      })
    );
  }

  saveEditToState(newState, id) {
    let newRecipes = this.state.recipes;
    if (id === null) {
      this.setState(Object.assign({}, this.state, newRecipes.push(newState)));
    } else {
      newRecipes[id].name = newState.name;
      newRecipes[id].ingredients = newState.ingredients;
      this.setState(Object.assign({}, this.state, newRecipes));
    }
    this.modalControl(id);
  }

  deleteRecipe(id) {
    let newRecipes = this.state.recipes;
    let filteredRecipes = newRecipes.filter(entry => entry.id !== id);
    this.setState(Object.assign({}, this.state, { recipes: filteredRecipes }));
  }

  render() {
    let modalShow = this.state.isModalActive;
    return (
      <div className="container">
        {modalShow && <div className="modal-transparent-background" />}
        {modalShow && (
          <Modal
            modalControl={this.modalControl}
            onChange={this.onChange}
            saveEditToState={this.saveEditToState}
            state={this.state}
          />
        )}

        <div className="list-border-container">
          <div className="list-wrapper">
            {this.state.recipes.map(val => (
              <RecipeListItem
                mapVal={val}
                id={val.id}
                modalControl={this.modalControl}
                showIngredients={this.showIngredients}
                deleteRecipe={this.deleteRecipe}
              />
            ))}
          </div>

          <button
            className="add-recipe-btn"
            onClick={evt => this.modalControl(null)}
          >
            Add Recipe
          </button>
        </div>
      </div>
    );
  }
}

const RecipeListItem = props => {
  return (
    <div className="recipe-row-item">
      <div key={props.id} onClick={evt => props.showIngredients(props.id)}>
        <h3 className="recipe-name-text" id={props.id}>
          {props.mapVal.name}
        </h3>
        <p className="recipe-name-dropdown" id={props.id}>
          &#9660;
        </p>
      </div>
      {props.mapVal.show && (
        <Recipe
          id={props.id}
          ingredients={props.mapVal.ingredients}
          modalControl={props.modalControl}
          deleteRecipe={props.deleteRecipe}
        />
      )}
      <hr />
    </div>
  );
};

const Recipe = props => {
  let ingredientsArr = props.ingredients.split(",");
  return (
    <div className="recipe-detail-container">
      {ingredientsArr.map((val, idx) => <li key={idx}>{val}</li>)}
      <button onClick={evt => props.modalControl(props.id)}>Edit Recipe</button>
      <button onClick={evt => props.deleteRecipe(props.id)}>
        Delete This Recipe
      </button>
    </div>
  );
};

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name:
        this.props.state.modalItemId === null
          ? ""
          : this.props.state.recipes[this.props.state.modalItemId].name,
      ingredients:
        this.props.state.modalItemId === null
          ? ""
          : this.props.state.recipes[this.props.state.modalItemId].ingredients
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    let field = evt.target.name;
    let newState = { id: this.props.state.recipes.length + 1 };
    newState[field] = evt.target.value;
    this.setState(Object.assign({}, this.state, newState));
  }

  render() {
    let id = this.props.state.modalItemId;

    return (
      <div className="add-recipe-modal">
        <input
          name="name"
          placeholder="Recipe Name"
          value={this.state.name}
          onChange={evt => this.onChange(evt)}
        />
        <textarea
          name="ingredients"
          placeholder="Ingredients"
          value={this.state.ingredients}
          onChange={evt => this.onChange(evt)}
        />
        <button onClick={evt => this.props.saveEditToState(this.state, id)}>
          Save
        </button>
        <button onClick={evt => this.props.modalControl()}>close</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
