import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiProjectConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

// Replace your code here
class App extends Component {
  state = {
    selectTag: 'ALL',
    projectData: [],
    apiStatus: apiProjectConstant.initial,
  }

  componentDidMount() {
    this.getProjectData()
  }

  getProjectData = async () => {
    this.setState({apiStatus: apiProjectConstant.in_progress})
    const {selectTag} = this.state

    const url = `https://apis.ccbp.in/ps/projects?category=${selectTag}`

    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(eachData => ({
        id: eachData.id,
        name: eachData.name,
        imageUrl: eachData.image_url,
      }))
      this.setState({
        projectData: updatedData,
        apiStatus: apiProjectConstant.success,
      })
    } else {
      this.setState({apiStatus: apiProjectConstant.failure})
    }
  }

  onChangeSelectOption = event => {
    this.setState({selectTag: event.target.value}, this.getProjectData)
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#00Bfff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-text">
        We cannot seem to find the page you are looking for
      </p>
      <button className="retry-btn" type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  onClickRetry = () => {
    this.getProjectData()
  }

  renderSuccessView = () => {
    const {projectData} = this.state

    return (
      <ul className="project-list">
        {projectData.map(eachProject => (
          <li className="project-item" key={eachProject.id}>
            <img
              className="project-image"
              src={eachProject.imageUrl}
              alt={eachProject.name}
            />
            <p className="project-name">{eachProject.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderProjectDataView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiProjectConstant.success:
        return this.renderSuccessView()
      case apiProjectConstant.failure:
        return this.renderFailureView()
      case apiProjectConstant.in_progress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {selectTag} = this.state
    return (
      <div className="app-container">
        <div className="header-container">
          <img
            className="header-image"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </div>
        <div className="select-container">
          <select
            className="select-list"
            value={selectTag}
            onChange={this.onChangeSelectOption}
          >
            {categoriesList.map(eachCategory => (
              <option
                className="option-item"
                key={eachCategory.id}
                value={eachCategory.id}
              >
                {eachCategory.displayText}
              </option>
            ))}
          </select>
        </div>
        {this.renderProjectDataView()}
      </div>
    )
  }
}

export default App
