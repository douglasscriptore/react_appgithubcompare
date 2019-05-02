import React from 'react'
import logo from '../../assets/logo.png'
import { Container, Form } from './styles'
import CompareList from '../../components/CompareList'

const Main = () => (
  <Container>
    <img src={logo} alt='Git compare' />

    <Form>
      <input type='text' placeholder='Usuario/repositório' />
      <button type='submit'>OK</button>
    </Form>

    <CompareList />
  </Container>
)

export default Main
