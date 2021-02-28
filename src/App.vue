<template>
  <div id="app">
    <section class="hero">
      <div class="hero-body">
        <User :userData="soundcloud[0].user" />
      </div>
    </section>
    <section class="section">
      <div class="columns is-multiline">
        <div class="column is-12-mobile is-6-tablet is-6-desktop">
          <div class="field has-addons">
            <div class="control">
              <input class="input" placeholder="Find a track" type="search" name="xddd" id="xd"
                v-model="searchedPhrase" />
            </div>
            <div class="control">
              <button class="button is-dark" v-on:click="search('phrase')">Search</button>
            </div>
            <div class="control">
              <button class="button is-dark" v-on:click="clear">Cancel</button>
            </div>
          </div>
          <div class="field has-addons">
            <div class="select">
              <select name="periods" v-model="selectedPeriod" @change="search('date')">
                <option :value="period" v-for="period in periods" :key="period">{{ period }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="column is-12-mobile is-6-tablet is-6-desktop">
          <line-chart :chart-data="tagAnalitics" :options="options" style="width: 100%; height:100%;" />
        </div>
        <div class="column is-12-mobile is-12-tablet is-12-desktop">
          <div class="tabs is-fullwidth" @click="isTagsHidden=!isTagsHidden">
            <ul>
              <li>
                <a>
                  <span class="icon"><i class="fas fa-angle-left" aria-hidden="true"></i></span>
                  <span>Show tags</span>
                </a>
              </li>
            </ul>
          </div>
          <div class="container" v-if="!isTagsHidden">
            <div class="buttons are-small">
              <button class="button is-link" v-for="tag in tags" :key="tag" :value="tag" @click="search('tag', tag)">
                {{ tag }}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="columns is-multiline is-mobile">
        <div class="is-12-mobile is-12-tablet is-12-desktop has-text-primary-light"> Found {{searchedData.length}} of
          {{soundcloud.length}} tracks


          <div> {{tagAnalitics.datasets[0].data}}</div>
        </div>

        <Card class="is-6-mobile is-3-tablet is-2-desktop" v-for="repost in searchedData" :key="repost.uuid"
          :repost="repost" />
      </div>
    </section>
  </div>
</template>

<script>
  import myData from './assets/dataset/sorted.json'
  import Card from './components/Card.vue'
  import User from './components/User.vue'
  import LineChart from './components/LineChart.vue'



  export default {
    name: 'App',
    components: {
      Card,
      User,
      LineChart
    },
    data: function () {
      return {
        soundcloud: myData.list,
        searchedData: [],
        searchedPhrase: "",
        selectedPeriod: null,
        tagAnalitics: {
          labels: [],
          datasets: [{
            label: 'Repost statistics',
            backgroundColor: '#5AC18E',
            data: []
          }]
        },
        isTagsHidden: true,
        options: {
          scales: {
            xAxes: [{
              type: 'time',
              display: true,
              distribution: 'series',
              time: {
                unit: "month",
              }
            }]
          }
        }
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
            this.createDatasetByTag(value)
            break;

          case "phrase":
            searched = this.searchedPhrase ? this.searchByPhrase(this.searchedPhrase.toLowerCase()) : this.soundcloud;
            this.createDatasetByPhrase(this.searchedPhrase)
            break;
        }
        this.searchedData = searched;
      },
      clear: function () {
        this.searchedData = this.soundcloud;
      },
      hasUsername(entry, username) {
        return entry.track.user.permalink.toLowerCase().includes(username) || entry.track.user.username.toLowerCase()
          .includes(username)
      },
      hasTrackTitle(entry, title) {
        return entry.track.title.toLowerCase().includes(title);
      },
      searchByPhrase(phrase) {
        return this.soundcloud
          .filter(entry => entry.track && entry.track.user)
          .filter(entry => this.hasUsername(entry, phrase) || this.hasTrackTitle(entry, phrase))
      },
      searchByTag: function (tag) {
        return this.soundcloud
          .filter(entry => entry && entry.track && entry.track.genre)
          .filter(entry => entry.track.genre.toLowerCase().includes(tag))

      },
      searchByDate: function (yearMonth) {
        return this.soundcloud
          .filter(entry => entry.created_at.includes(yearMonth))
      },
      createDatasetByTag: function (tag) {
        var dataset = {};

        this.soundcloud
          .filter(entry => entry && entry.track && entry.track.genre)
          .filter(entry => entry.track.genre.toLowerCase().includes(tag))
          .map(entry => entry.created_at.split("T")[0].slice(0, -3))
          .forEach(element => {
            if (!dataset[element]) {
              dataset[element] = 0;
            }
            dataset[element] += 1;
          });
        console.log(dataset)
        var datac = [];
        Object.entries(dataset).forEach(e => datac.push({
          x: e[0] + '-01',
          y: e[1]
        }));
        this.tagAnalitics = {
          labels: [],
          datasets: [{
            label: 'Repost statistics',
            backgroundColor: '#5AC18E',
            data: datac
          }]
        }
      },
      createDatasetByPhrase: function (phrase) {
        var dataset = {};
        this.soundcloud
          .filter(entry => entry.track && entry.track.user)
          .filter(entry => this.hasUsername(entry, phrase) || this.hasTrackTitle(entry, phrase))
          .map(entry => entry.created_at.split("T")[0].slice(0, -3))
          .forEach(element => {
            if (!dataset[element]) {
              dataset[element] = 0;
            }
            dataset[element] += 1;
          });
        var datac = [];
        Object.entries(dataset).forEach(e => datac.push({
          x: e[0] + '-01',
          y: e[1]
        }));
        console.log(datac)
        this.tagAnalitics = {
          labels: [],
          datasets: [{
            label: 'Repost statistics',
            backgroundColor: '#5AC18E',
            data: datac
          }]
        }
      }
    },
    computed: {
      tags: function () {
        let genres = this.soundcloud
          .filter(entry => entry && entry.track && entry.track.genre)
          .map(entry => entry.track.genre.toLowerCase())
          .sort();
        return new Set(genres)
      },
      years: function () {
        let SOUNDCLOUD_RELEASE_YEAR = 2007,
          currentYear = new Date().getFullYear(),
          years = [];

        while (SOUNDCLOUD_RELEASE_YEAR <= currentYear) {
          years.push(SOUNDCLOUD_RELEASE_YEAR++);
        }
        return years;
      },
      periods: function () {
        let periods = this.soundcloud
          .filter(entry => entry && entry.created_at)
          .map(entry => entry.created_at.split("T")[0].slice(0, -3))
          .sort();
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