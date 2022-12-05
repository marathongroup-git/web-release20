import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { getAll } from '../../actions'
import Title from '../../components/Title'
import Text from '../../components/Text'
import Button from '../../components/Button'
import banner from '../../assets/static/divisions/banner.jpg'
import { BsChevronRight } from 'react-icons/bs'
import moment from 'moment'
import './styles.scss'

const Wiki = props => {
  const { posts, categories, user, departments } = props
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [search, setSearch] = useState('')

  useEffect(() => {
    props
      .getAll('wiki', 'GET_POSTS')
      .then(() => {
        props.getAll('wiki/categories', 'GET_CATEGORIES')
      })
      .then(() => {
        props.getAll('users/departments', 'GET_DEPARTMENTS')
      })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (departments && categories) {
      const department = departments.find(
        department => parseInt(department.id) === parseInt(user.department)
      )

      console.log(department, 'department')

      if (department !== undefined && parseInt(user.role) === 5) {
        setSelectedCategory(
          categories.find(category => category.name === department.name).id
        )
      }
    }
    // eslint-disable-next-line
  }, [departments, categories])

  if (departments && posts && categories) {
    const categoryFiltered =
      selectedCategory !== 0
        ? posts.filter(post => post.category_id === selectedCategory)
        : posts

    const searchFiltered = categoryFiltered.filter(post =>
      post.title.toLowerCase().includes(search)
    )

    let data =
      parseInt(user.role) === 5
        ? posts.filter(post => post.category_id === selectedCategory)
        : posts

    return (
      <div className="wiki">
        <div
          className="wiki__background"
          style={{
            backgroundImage: `linear-gradient(
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.5)
      ), url(${banner})`,
          }}
        >
          <Title className="title --center --white">Marathon Wiki</Title>
          {/*  <Text className="text --center --white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae,
            consequatur..
          </Text> */}
        </div>
        <div className="wikiContainer">
          <div className="wikiContainer__content">
            {posts ? (
              searchFiltered.map(post => (
                <div className="wiki__entry">
                  <img
                    src={`${process.env.REACT_APP_API}docs/wiki/${post.img}`}
                    alt=""
                  />
                  <div className="wiki__textBox">
                    <span>
                      {moment(post.created).format('YYYY-mm-DD')} | By{' '}
                      {post.user_name}
                    </span>
                    <div>{post.title}</div>
                    <p>{post.paragraph}</p>
                    <a href={`wiki/${post.id}`}>
                      <Button>Leer más...</Button>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="wiki__entry">
                <img src={banner} alt="" />
                <div className="wiki__textBox">
                  <span>2020-01-01 | By Marathon</span>
                  <div>Seven Doubts You Should Clarify About</div>
                  <p>
                    All the Lorem Ipsum generators on the Internet tend to
                    repeat predefined chunks as necessary, making this the…
                  </p>
                  <Button>Leer más...</Button>
                </div>
              </div>
            )}
          </div>
          <div className="wikiContainer__history">
            <div className="wiki__divider">Buscar</div>
            <input
              className="wiki__input"
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..."
            />
            <div className="wiki__divider">Post Recientes</div>
            {posts ? (
              data.slice(0, 3).map(post => (
                <div className="wiki__entryBlog">
                  <img
                    src={`${process.env.REACT_APP_API}docs/wiki/${post.img}`}
                    alt=""
                  />
                  <div className="wiki__textBoxBlog">
                    <span>
                      {moment(post.created).format('YYYY-mm-DD')} | By{' '}
                      {post.user_name}
                    </span>
                    <div>{post.title}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="wiki__entryBlog">
                <img src={banner} alt="" />
                <div className="wiki__textBoxBlog">
                  <span>2020-01-01 | By Marathon</span>
                  <div>Seven Doubts You Should Clarify About</div>
                </div>
              </div>
            )}
            {parseInt(user.role) !== 5 ? (
              <div>
                <div className="wiki__divider">Categorías</div>
                <div
                  className="wiki__month"
                  onClick={() => setSelectedCategory(0)}
                >
                  <BsChevronRight /> Todas
                  <hr />
                </div>
                {categories
                  ? categories.map(category => (
                      <div
                        className="wiki__month"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <BsChevronRight /> {category.name}
                        <hr />
                      </div>
                    ))
                  : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  } else {
    return <div>Cargando...</div>
  }
}

const mapStateToProps = state => {
  return {
    posts: state.reducerWiki.posts,
    categories: state.reducerWiki.categories,
    user: state.reducersApp.user,
    departments: state.reducerWiki.departments,
  }
}

const mapDispatchToProps = {
  getAll,
}

export default connect(mapStateToProps, mapDispatchToProps)(Wiki)
