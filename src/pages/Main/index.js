import React, { Component } from 'react'
import moment from 'moment'
import api from '../../services/api'
import logo from '../../assets/logo.png'

import { Container, Form } from './styles'
import CompareList from '../../components/CompareList'

export default class Main extends Component {
  state = {
    loading: false,
    repositoryInput: '',
    repositoryError: false,
    repositories: []
  }

  componentDidMount () {
    this.getLocalRepos()
  }

  getLocalRepos = async () => {
    if (localStorage.getItem('repositories')) {
      this.setState({
        repositories: JSON.parse(await localStorage.getItem('repositories'))
      })
    }
  }

  // Adiciona repository
  handleAddRepository = async e => {
    e.preventDefault()

    this.setState({ loading: true })

    try {
      const { data: repository } = await api.get(
        `/repos/${this.state.repositoryInput}`
      )
      // nunca se deve formatar informações dentro do render, sempre fora do render
      repository.lastCommit = moment(repository.pushed_at).fromNow()

      this.setState({
        repositoryInput: '',
        repositoryError: false,
        repositories: [...this.state.repositories, repository]
      })

      // adiciona a lista no localStorage
      localStorage.setItem(
        'repositories',
        JSON.stringify(this.state.repositories)
      )
    } catch (err) {
      this.setState({ repositoryError: true })
    } finally {
      this.setState({ loading: false })
    }
  }

  // paga repositorio
  handleUpdate = async repositoryId => {
    // inicializa o loading
    this.setState({ loading: true })

    // recupera a lista de repositorios
    const { repositories } = this.state

    // recuperar repo
    const repository = repositories.find(repo => repo.id === repositoryId)

    // faz busca na api do github
    const { data } = await api.get(`/repos/${repository.full_name}`)

    // cria data humanizada
    data.lastCommit = moment(data.pushed_at).fromNow()

    // set novo status
    this.setState({
      repositories: repositories.map(repo =>
        repo.id === data.id ? data : repo
      )
    })

    // atualiza valor do local storage
    await localStorage.setItem('repositories', JSON.stringify(repositories))
    try {
    } catch (err) {
      this.setState({ repositoryError: true })
    } finally {
      this.setState({ loading: false })
    }
  }

  // atualiza repositorio
  handleDelete = async repositoryId => {
    // recupera os repositorios
    const { repositories } = this.state

    // realiza o filtro das listas
    const newRepositoriesList = repositories.filter(
      repository => repository.id !== repositoryId
    )

    // atualiza o state
    this.setState({ repositories: newRepositoriesList })

    await localStorage.setItem(
      'repositories',
      JSON.stringify(newRepositoriesList)
    )
  }

  render () {
    return (
      <Container>
        <img src={logo} alt='Git compare' />
        {/* A propriedade withError pode ser qualquer coisa */}

        <Form
          withError={this.state.repositoryError}
          onSubmit={this.handleAddRepository}
        >
          <input
            type='text'
            value={this.state.repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
            placeholder='Usuario/repositório'
          />
          <button type='submit'>
            {this.state.loading ? (
              <i className='fa fa-spinner fa-pulse' />
            ) : (
              <i className='fa fa-plus' />
            )}
          </button>
        </Form>

        <CompareList
          repositories={this.state.repositories}
          handleUpdate={this.handleUpdate}
          handleDelete={this.handleDelete}
        />
      </Container>
    )
  }
}
