<template>
  <div id="app" class="section">
    <section class="hero">
      <div class="hero-body">
        <User :userData="soundcloud[0].user"/>
      </div>
    </section>
    <section class="section" >
      <div class="title has-text-primary-light"> Found {{searchedData.length}} of {{soundcloud.length}} tracks </div>
        <div class="field has-addons">
          <div class="control">
            <input class="input" placeholder="Find a track" type="search" name="xddd" id="xd" v-model="searchedPhrase"/>
          </div>
          <div class="control">
            <button class="button is-dark" v-on:click="search('phrase')">Search</button>
          </div>
          <div class="control">
            <button class="button is-dark" v-once v-on:click="clear">Cancel</button>
          </div>
        </div>
        <div class="field has-addons">
          <div class="select">
            <select name="periods" v-model="selectedPeriod">
              <option :value="period" v-for="period in periods" :key="period">{{ period }}</option>
           </select> 
          </div>
          <button class="button is-link" @click="search('date')"> search </button>

        </div> 
      <div v-if="isLoading" class="title"> loading ... </div>
      <div>
        <div class="buttons are-small">
          <button class="button is-link" v-for="tag in tags" :key="tag" :value="tag" @click="search('tag', tag)"> {{ tag }}</button>
        </div>
      </div>
      <div class="columns is-multiline is-mobile" v-if="!isLoading">
        <Card class="is-6-mobile is-3-tablet is-2-desktop" v-for="repost in searchedData" :key="repost.uuid" :repost="repost"/>
      </div>
    </section>
  </div>
</template>

<script>
import myData from './assets/dataset/sorted.json'
import Card from './components/Card.vue'
import User from './components/User.vue'

export default {
  name: 'App',
  components: {
    Card,
    User
  },
  data: function () {
    return {
      soundcloud: myData.list,
      searchedData: myData.list,
      searchedPhrase: "",
      isLoading: false,
      months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
      selectedPeriod: null
    }
  },
  methods: {
    search: function (type, value = "") {
      var searched;
      switch (type) {
        case "date": 
          searched = this.selectedPeriod ? this.searchByDate(this.selectedPeriod) : this.soundcloud;
        break;

        case "tag":
          searched = value ? this.searchByTag(value) : this.soundcloud;
        break;

        case "phrase": 
          searched = this.searchedPhrase ? this.searchByPhrase(this.searchedPhrase.toLowerCase()) : this.soundcloud;
        break;
      }
      console.log(searched);
      this.isLoading = false;
      this.searchedData = searched;
    },
    clear: function () {
      this.searchedData = this.soundcloud;
    },
    hasUsername(entry, username) {
      return entry.track.user.permalink.toLowerCase().includes(username) || entry.track.user.username.toLowerCase().includes(username)
    },
    hasTrackTitle(entry, title) {
      return entry.track.title.toLowerCase().includes(title);
    },
    searchByPhrase(phrase) {
      this.isLoading = true;
      return this.soundcloud
              .filter(entry => entry.track && entry.track.user)
              .filter(entry => this.hasUsername(entry, phrase) || this.hasTrackTitle(entry, phrase)) 
    },
    searchByTag: function (tag) {
      this.isLoading = true;
      return this.soundcloud
              .filter(entry => entry && entry.track && entry.track.genre)
              .filter(entry => entry.track.genre.toLowerCase().includes(tag)) 

    },
    searchByDate: function (yearMonth) {
      this.isLoading = true;
      console.log(yearMonth)
      return this.soundcloud
              .filter(entry => entry.created_at.includes(yearMonth)) 
    },
  },
  computed: {
    tags: function () {
      let genres = this.soundcloud
                        .filter(entry => entry && entry.track && entry.track.genre)
                        .map(entry => entry.track.genre.toLowerCase())
                        .sort();
      console.log(new Set(genres))
      return new Set(genres)
    },
    years: function () {
      let SOUNDCLOUD_RELEASE_YEAR = 2007,
        currentYear = new Date().getFullYear(), 
        years = [];

      while ( SOUNDCLOUD_RELEASE_YEAR <= currentYear ) {
          years.push(SOUNDCLOUD_RELEASE_YEAR++);
      }   
      return years;
    },
    periods: function () {
       let periods = this.soundcloud
                        .filter(entry => entry && entry.created_at)
                        .map(entry => entry.created_at.split("T")[0].slice(0,-3))
                        .sort();
      console.log(new Set(periods))
      return new Set(periods)
    }
  }
}
</script>

<style>
@import '../node_modules/bulma/css/bulma.min.css';

body {
  background: hsl(0, 0%, 4%);
  min-height: 100vh;
  width: 100%;
}
</style>
