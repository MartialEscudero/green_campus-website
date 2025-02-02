<template>
<!-- Navbar -->
<nav class="z-10">
  <div class="container mx-auto px-4">
    <div class="flex justify-between">

      <!-- Menu -->
      <div class="flex space-x-4">
        <!-- Logo -->
        <div>
          <Nuxt-link to="/" class="flex items-center"><img src="~/assets/img/full_logo.png" class="h-18 w-18 mr-1" alt="Logo Green Campus"></Nuxt-link>
        </div>
      </div>

      <!-- Desktop menu-->
      <div v-if="this.$route.name === 'index'">
        <div v-if="multilingual.navbar" class="hidden md:flex items-center space-x-1.5">
          <Nuxt-link to="/" class="text-white px-3 py-2 underline-link">{{multilingual.navbar[0]}}</Nuxt-link>
          <Nuxt-link to="/qr-code" class="px-3 py-2 underline-link">{{multilingual.navbar[1]}}</Nuxt-link>
          <Nuxt-link to="/sentiers" class="px-3 py-2 underline-link">{{multilingual.navbar[2]}}</Nuxt-link>
          <Nuxt-link to="/map" class="px-3 py-2 underline-link">{{multilingual.navbar[3]}}</Nuxt-link>
          <Nuxt-link to="/a-propos" class="px-3 py-2 underline-link">{{multilingual.navbar[4]}}</Nuxt-link>
          <v-switch 
            v-model="langswitch" 
            :label="`${langswitch ? 'FR' : 'EN'}`"
            @click="switchLang()"
            color="#066664"
          ></v-switch>
        </div>
      </div>
      <div v-else>
        <div v-if="multilingual.navbar" class="navbar hidden md:flex items-center space-x-1.5">
          <Nuxt-link to="/" class="px-3 py-2 underline-link">{{multilingual.navbar[0]}}</Nuxt-link>
          <Nuxt-link to="/qr-code" class="px-3 py-2 underline-link">{{multilingual.navbar[1]}}</Nuxt-link>
          <Nuxt-link to="/sentiers" class="px-3 py-2 underline-link">{{multilingual.navbar[2]}}</Nuxt-link>
          <Nuxt-link to="/map" class="px-3 py-2 underline-link">{{multilingual.navbar[3]}}</Nuxt-link>
          <Nuxt-link to="/a-propos" class="px-3 py-2 underline-link">{{multilingual.navbar[4]}}</Nuxt-link>
          <v-switch 
            v-model="langswitch" 
            :label="`${langswitch ? 'FR' : 'EN'}`"
            @click="switchLang()"
            color="#066664"
          ></v-switch>
        </div>
      </div>

      <!-- Mobile button -->
      <div class="absolute md:hidden right-4 top-8">
          <button @click="showMobileMenu = !showMobileMenu">
            <svg v-if="showMobileMenu" xmlns="http://www.w3.org/2000/svg" class="w-10 h-" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-else class="w-10 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
      </div> 
      
    </div>
  </div>

  <!-- Mobile menu -->
  
    <div v-if="multilingual.navbar" class="mobile-menu md:hidden "><transition name="fade">
      <div v-if="showMobileMenu" class="bg-gradient-to-r from-[#a5e2b4] via-[#80c69d] to-[#5aa687] pt-5">
        <a @click="showMobileMenu = !showMobileMenu"><Nuxt-link to="/" class="block text-center py-5 white-link font-sans uppercase text-2xl font-bold">{{multilingual.navbar[0]}}</Nuxt-link></a>
        <a @click="showMobileMenu = !showMobileMenu"><Nuxt-link to="/qr-code" class="block text-center py-5 white-link font-sans uppercase text-2xl font-bold">{{multilingual.navbar[1]}}</Nuxt-link></a>
        <a @click="showMobileMenu = !showMobileMenu"><Nuxt-link to="/sentiers" class="block text-center py-5 white-link font-sans uppercase text-2xl font-bold">{{multilingual.navbar[2]}}</Nuxt-link></a>
        <a @click="showMobileMenu = !showMobileMenu"><Nuxt-link to="/map" class="block text-center py-5 white-link font-sans uppercase text-2xl font-bold">{{multilingual.navbar[3]}}</Nuxt-link></a>
        <a @click="showMobileMenu = !showMobileMenu"><Nuxt-link to="/a-propos" class="block text-center py-5 white-link font-sans uppercase text-2xl font-bold">{{multilingual.navbar[4]}}</Nuxt-link></a>
        <div class="d-flex justify-center font-bold pb-5">
          <a @click="showMobileMenu = !showMobileMenu">
            <v-switch 
              v-model="langswitch" 
              :label="`${langswitch ? 'FR' : 'EN'}`"
              @click="switchLang()"
              color="#066664"
            ></v-switch>
          </a>
        </div>
      </div></transition>
    </div>
  

</nav>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  data () {
    return {
      langswitch: false,
      showMobileMenu: false,
    }
  },
  methods: {
    ...mapActions('store',['getSentiers','getSentier','getMultilingual','getPoi']),
    
    ...mapMutations('store',['setLangLocale', 'setLang']),
    
    getLang() {
      var lang = localStorage.getItem('lang')
      if (!lang) {
        localStorage.setItem('lang', 'fr');
        this.setLangLocale("fr")
        this.langswitch = false
      } else {
        this.setLangLocale(lang) 
        if (lang === "fr") {
          this.langswitch = false
        }
        if (lang === "en") {
          this.langswitch = true
        }
      }
    },

    switchLang() {
      this.getMultilingual(),
      this.setLang(this.langswitch),
      this.getSentiers()
      if (this.$route.name === "sentier-slug") {
        this.getSentier(this.$route.params.slug);
      }
      if (this.$route.name === "point-interet-slug") {
        this.getPoi(this.$route.params.slug);
      }
    }, 
  },
  computed: {
    ...mapGetters('store',['multilingual'])
  },
  mounted() {
    this.getMultilingual(),
    this.getLang()
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
}

svg { 
  color: #066664;
}

.underline-link.nuxt-link-exact-active {
  color: white;
  border-bottom: 2px solid white;
}

.v-application a.white-link  {
  color: white;
}

.underline-link  {
  color: white;
}

.navbar .underline-link.nuxt-link-exact-active {
  color: #066664;
  border-bottom: 2px solid #066664;
}

.navbar .v-application a.white-link  {
  color: white;
}

.navbar .underline-link  {
  color: #066664;
}

.fade-enter {
  transform: translateY(-300%);
}

.fade-enter-to {
  transform: translateY();
}

.fade-leave-to {
  transform: translateY(-80%);
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: all .3s ease-in-out, transform .3s;
}
</style>