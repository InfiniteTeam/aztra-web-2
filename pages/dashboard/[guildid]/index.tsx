import React, { Component } from 'react';
import axios from 'axios'
import { Card, Button, Row, Col, Container, Spinner } from 'react-bootstrap'
import { MemberMinimal, PartialGuild } from 'types/DiscordTypes'
import urljoin from 'url-join';
import api from 'datas/api';
import Layout from 'components/Layout';
import DashboardLayout from 'components/DashboardLayout';
import { withRouter } from 'next/router';
import { WithRouterProps } from 'next/dist/client/with-router';

import Cookies from 'universal-cookie'
import { GetServerSideProps } from 'next';

interface MainRouterProps {
  guildId: string
}

type MainProps = MainRouterProps & WithRouterProps

interface MainState {
  membersFetchDone: boolean
  members: MemberMinimal[] | null
}

export const getServerSideProps: GetServerSideProps<MainRouterProps> = async context => {
  const { guildid } = context.query
  return {
    props: { 
      guildId: guildid as string
    }
  }
}

class Main extends Component<MainProps, MainState> {
  state: MainState = {
    membersFetchDone: false,
    members: null
  }

  componentDidMount() {
    const token = new Cookies().get('ACCESS_TOKEN')
    if (token) {
      this.getMembers(token)
    }
    else {
      const lct = window.location
      localStorage.setItem('loginFrom', lct.pathname + lct.search)
      this.props.router.push('/login')
    }
  }

  getMembers = async (token: string) => {
    try {
      let res = await axios.get(`${api}/discord/guilds/${this.props.guildId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(res.data)
      this.setState({ members: res.data })
    }
    catch (e) {
      this.setState({ members: null })
    }
    finally {
      this.setState({ membersFetchDone: true })
    }
  }

  render() {
    return (
      <Layout>
        <DashboardLayout guildId={this.props.guildId}>
          {
            (guild) => guild && this.state.membersFetchDone ? (
              <div className="text-white" style={{
                fontFamily: 'NanumBarunGothic'
              }}>
                <Row>
                  <h3>서버 정보</h3>
                </Row>
                <Row className="dashboard-section">
                  <Col className="col-auto">
                    <Card className="flex-md-row my-3 shadow" bg="dark">
                      <Card.Body className="text-center text-md-left">
                        <div style={{
                          height: 120,
                          width: 120
                        }}>
                          {guild?.icon
                            ? <Card.Img
                              src={`https://cdn.discordapp.com/icons/${guild?.id}/${guild?.icon}.png?size=512`}
                            />
                            : <h1 className="d-flex justify-content-center align-items-center w-100 h-100 display-3">{guild?.name[0]}</h1>
                          }
                        </div>
                      </Card.Body>
                      <Card.Body className="pl-md-0 pr-md-5" style={{

                      }}>
                        <Card.Title className="font-weight-bold text-center text-md-left" style={{
                          fontFamily: 'NanumSquare'
                        }}>
                          {guild?.name}
                        </Card.Title>
                        <Card.Text as="div" className="lines">
                          <p>
                            전체 멤버 수: {this.state.members?.length} 명
                        </p>
                          <p>
                            전체 중 봇 멤버: {this.state.members?.filter(m => m.user.bot).length} 명
                        </p>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <h3>알림 센터</h3>
                  <div className="ml-4">
                    <Button variant="secondary" size="sm">더 보기</Button>
                  </div>
                </Row>
                <Row className="dashboard-section">
                  <Col xs={6} md={3}>
                    <Card className="Dashboard-card my-3 shadow" bg="dark">
                      <Card.Body>
                        <Card.Title>개발 중</Card.Title>
                        <Card.Text>
                          <span className="font-weight-bold">이 기능</span>은 개발 중입니다.
                        </Card.Text>
                        <Button variant="secondary" size="sm">자세히</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            ) : <Container className="d-flex align-items-center justify-content-center flex-column" style={{
              height: '500px'
            }}>
                <h3 className="pb-4">불러오는 중</h3>
                <Spinner animation="border" variant="aztra" />
              </Container>
          }
        </DashboardLayout>
      </Layout>
    )
  }
}

export default withRouter(Main)