import axios from 'axios'

const strapi = "https://admingreencampus.herokuapp.com/api/"

export const state = () => ({
  heroku: false,
  multilingual: {},
  lang : 'fr',
  sentiers: [],
  sentier: [],
  poi: [],
})

export const mutations = {
  setMultilingual(state,args) {
    state.multilingual = args[state.lang]
  },

  setLang(state, args) {
    if (args === false) {
      state.lang = "fr"
      localStorage.setItem('lang', 'fr');
    }
    if (args === true) {
      state.lang = "en"
      localStorage.setItem('lang', 'en');
    }
  },

  setLangLocale(state, args) {
    state.lang = args
  },

  setSentiers(state, args) {
    state.sentiers = args.data
  },

  setSentier(state, args) {
    state.sentier = args.data[0].attributes
  },

  setPoi(state, args) {
    state.poi = args.data[0].attributes
  },

  setHerokuDialog(state) {
    state.heroku = true
  }
}

export const actions = {
  getMultilingual({commit}) {
    axios.get('/multilingual.json')
    .then((res) => {
      commit('setMultilingual', res.data)
    })
    .catch((err) => {
      console.error(err)
    })
  },

  getLangLocale({commit}, item) {
    commit('setLangLocale', item)
  },

  changeLang({commit}, item) {
    commit('setLang', item)
  },

  async getSentiers({commit, state}) {
    //les données sont en attente  
    await axios.get(strapi + 'sentiers?populate=%2A&locale=' + state.lang)
    .then(async (res) => {
    // Je récupère le fichier geojson et je réinjecte son contenu dans l'Object sentier dans une nouvelle entrée dataMap aussi en injectant la couleur.
    for (var i = 0; i < res.data.data.length; i++) {
        const response = await fetch(res.data.data[i].attributes.GeoJSON.data.attributes.url);
        var res2 = await response.json()
        res.data.data[i].attributes.GeoJSON.dataMap = (res2.features[0])
        res.data.data[i].attributes.GeoJSON.dataMap.properties = {
          "color" : res.data.data[i].attributes.Couleur
        }
      }
      commit('setSentiers', res.data)
    })
    .catch((err) => {
      console.error(err)
    })
    setTimeout(() => {
      if (state.sentiers.length === 0) {
        commit('setHerokuDialog')
        setTimeout(() => {
          location.reload();
        }, 30000);
      }
    }, 3000);
  },

  async getSentier({commit, state}, item) {
    await axios.get(strapi + 'sentiers?filters[UUID][$eq]=' + item + '&populate[0]=points_interet&populate[1]=GeoJSON&populate[2]=points_interet.Image&populate[3]=points_interet.Audio&populate[4]=Media' + '&locale=' + state.lang)
    .then((res) => {
      commit('setSentier', res.data)
    })
    .catch((err) => {
      console.error(err)
    })
  },

  getPoi({commit, state}, item) {
    axios.get(strapi + 'points-interet?populate=%2A&filters[UUID][$eq]=' + item + '&locale=' + state.lang)
    .then((res) => {
      commit('setPoi', res.data)
    })
    .catch((err) => {
      console.error(err)
    })
  }
}

export const getters = {
  sentiers : state => state.sentiers,
  sentier : state => state.sentier,
  poi : state => state.poi,
  lang : state => state.lang,
  multilingual : state => state.multilingual,
  heroku : state => state.heroku,
}