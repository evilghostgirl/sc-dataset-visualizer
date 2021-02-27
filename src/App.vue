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
            <button class="button is-dark" v-on:click="search">Search</button>
          </div>
          <div class="control">
            <button class="button is-dark" v-once v-on:click="clear">Cancel</button>
          </div>
        </div> 
      <div v-if="isLoading" class="title"> loading ... </div>
      <div>
        <div class="tags are-small">
          <span class="tag is-link" v-for="tag in tags" :key="tag" @click="tagSearch(tag)"> {{ tag }}</span>
        </div>
      </div>
      <div class="columns is-multiline is-mobile" v-if="!isLoading">
        <Card  class="is-6-mobile is-3-tablet is-2-desktop" v-for="repost in searchedData" :key="repost.uuid" :repost="repost"/>
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
      isLoading: false
    }
  },
  methods: {
    search: function () {
      var searched = this.searchedPhrase ? this.searchByPhrase(this.searchedPhrase.toLowerCase()) : this.soundcloud;
      console.log(searched);
      this.isLoading = false;
      this.searchedData = searched;
    },
    tagSearch: function (tag) {
      var searched = tag ? this.searchByTag(tag) : this.soundcloud;
      console.log(searched);
      this.isLoading = false;
      this.searchedData = searched;
    },
    searchByTag: function (tag) {
      this.isLoading = true;
      return this.soundcloud
              .filter(entry => entry && entry.track && entry.track.genre)
              .filter(entry => entry.track.genre.toLowerCase().includes(tag)) 

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
    }
  },
  computed: {
    tags: function () {
      let genres = this.soundcloud.filter(entry => entry && entry.track && entry.track.genre).map(entry => entry.track.genre.toLowerCase()).sort();
      console.log(new Set(genres))
      return new Set(genres)
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
