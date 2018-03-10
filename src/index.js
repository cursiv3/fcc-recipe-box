import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      recipes: [
        {
          id: 0,
          name: "cake",
          ingredients: "milk, eggs, flour",
          show: false
        },
        {
          id: 1,
          name: "chili mac",
          ingredients: "chili, mac n cheese",
          show: false
        }
      ],
      isModalActive: false,
      modalItemId: null
    };
    this.modalControl = this.modalControl.bind(this);
    this.showIngredients = this.showIngredients.bind(this);
    this.saveEditToState = this.saveEditToState.bind(this);
  }

  showIngredients(evt) {
    let target = this.state.recipes[evt.target.id];
    let newRecipes = this.state.recipes;
    target.show === false ? (target.show = true) : (target.show = false);
    newRecipes[evt.target.id] = target;
    this.setState(Object.assign({}, this.state, { recipes: newRecipes }));
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
    newRecipes[id].name = newState.name;
    newRecipes[id].ingredients = newState.ingredients;
    this.setState(Object.assign({}, this.state, newRecipes));
    this.modalControl(id);
  }

  render() {
    let modalShow = this.state.isModalActive;
    return (
      <div className="container">
        {modalShow && <div className="modal-transparent-background" />}
        <div className="list-wrapper">
          {this.state.recipes.map((val, idx) => (
            <RecipeListItem
              mapVal={val}
              mapIdx={idx}
              modalControl={this.modalControl}
              showIngredients={this.showIngredients}
            />
          ))}
          {modalShow && (
            <Modal
              modalControl={this.modalControl}
              onChange={this.onChange}
              saveEditToState={this.saveEditToState}
              state={this.state}
            />
          )}
        </div>
        <button>Add Recipe</button>
      </div>
    );
  }
}

const RecipeListItem = props => {
  return (
    <div className="recipe-row-item">
      <div
        id={props.mapIdx}
        key={props.mapIdx}
        onClick={evt => props.showIngredients(evt)}
      >
        {props.mapVal.name}
      </div>
      {props.mapVal.show && (
        <Recipe
          id={props.mapIdx}
          ingredients={props.mapVal.ingredients}
          modalControl={props.modalControl}
        />
      )}
    </div>
  );
};

const Recipe = props => {
  let ingredientsArr = props.ingredients.split(",");
  return (
    <div className="recipe-detail-container">
      {ingredientsArr.map((val, idx) => <div key={idx}>{val}</div>)}
      <button onClick={evt => props.modalControl(props.id)}>Edit Recipe</button>
      <button>Delete This Recipe</button>
    </div>
  );
};

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.state.recipes[this.props.state.modalItemId].name,
      ingredients: this.props.state.recipes[this.props.state.modalItemId]
        .ingredients
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    let field = evt.target.name;
    let newState = {};
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
