<template>
  <div id="app">
    <section class="section">
      <div class="columns is-multiline">
        <div class="column is-12-mobile is-12-tablet is-6-desktop is-4-widescreen">

          <div class="hero-body">
            <User :userData="soundcloud[0].user" />
          </div>
          <div class="columns is-multiline">
            <div class="column is-12-mobile is-8-tablet is-8-desktop">
              <div class="field has-addons">
                <div class="control">
                  <input class="input is-rounded" 
                         placeholder="Find a track" 
                         type="search" 
                         name="searchedPhrase"
                         id="searchedPhrase" 
                         v-model="searchedPhrase" 
                         @keyup.enter="search('phrase')" />
                </div>
                <div class="control">
                  <button class="button is-dark is-rounded" v-on:click="search('phrase')">
                    Search
                  </button>
                </div>
                <div class="control">
                  <button class="button is-dark is-rounded" v-on:click="clear">&#10006;</button>
                </div>
              </div>
            </div>
            <div class="column is-12-mobile is-4-tablet is-4-desktop">
              <div class="field has-addons">
                <div class="select is-rounded">
                  <select name="periods" v-model="selectedPeriod" @change="search('date')">
                    <option value="undefined" selected disabled> Year - month </option>
                    <option :value="period" v-for="period in periods" :key="period">
                      {{ period }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
<!-- {{ artistStatistics }} -->

          <line-chart :chart-data="tagAnalitics" 
                      :options="options" 
                      class="has-background-dark is-rounded p-2"
                      style="max-height:300px;" />

          <div class="tabs is-fullwidth" v-bind:class="[isTagsHidden ? '' : 'has-background-info', '']" @click="isTagsHidden=!isTagsHidden;areArtistsHidden=true">
            <ul>
              <li>
                <a>
                  <span class="icon"><i class="fas fa-angle-left" aria-hidden="true"></i></span>
                  <span v-if="isTagsHidden" class="has-text-primary">Show tags</span>
                  <span v-if="!isTagsHidden" class="has-text-primary">Hide tags</span>
                </a>
              </li>
            </ul>
          </div>
   
          <div class="container is-scrollable" v-if="!isTagsHidden" style="max-height:200px;">
            <div class="buttons are-small">
              <button class="button is-link" v-for="tag in tagsStatistics" :key="tag.name" :value="tag.name" @click="search('tag', tag.name)">
                {{ tag.name }} ({{ tag.count }})
              </button>
            </div>
          </div>
          <div class="tabs is-fullwidth" v-bind:class="[areArtistsHidden ? '' : 'has-background-info', '']" @click="areArtistsHidden=!areArtistsHidden;isTagsHidden=true">
            <ul>
              <li>
                <a>
                  <span class="icon"><i class="fas fa-angle-left" aria-hidden="true"></i></span>
                  <span v-if="areArtistsHidden" class="has-text-primary">Show top 100 artists</span>
                  <span v-if="!areArtistsHidden" class="has-text-primary">Hide top 100 artists</span>
                </a>
              </li>
            </ul>
          </div>
          <div class="container is-scrollable" v-if="!areArtistsHidden" style="max-height:200px;">
            <div class="buttons are-small">
              <button class="button is-link" v-for="artist in artistsStatistics" :key="artist.name" :value="artist.name" @click="searchedPhrase=artist.name;search('phrase')">
                {{ artist.name }} ({{ artist.count }})
              </button>
            </div>
          </div>
        </div>
        
        <div class="column is-12-mobile is-12-tablet is-6-desktop is-8-widescreen has-text-primary-light">
          <div class="columns is-mobile is-multiline is-scrollable is-fullheight is-align-content-flex-start">
            <div class="column is-12-mobile is-12-tablet is-12-desktop">
              Found {{searchedData.length}} of {{soundcloud.length}} tracks
            </div>

            <Card class="column is-6-mobile is-4-tablet is-4-desktop is-2-widescreen" 
                  v-for="repost in searchedData" 
                  :key="repost.uuid"
                  :repost="repost" />
          </div>
        </div>
      </div>

    </section>
  </div>
</template>


<script>
  import myData from './assets/dataset/sorted.example.json'
  import Card from './components/Card.vue'
  import User from './components/User.vue'
  import LineChart from './components/LineChart.vue'
  import latinize from 'latinize';

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
        selectedPeriod: undefined,
        tagAnalitics: {
          labels: [],
          datasets: [{
            label: 'Repost statistics',
            backgroundColor: 'rgba(81, 5, 180, 0.7)',
            data: []
          }]
        },
        isTagsHidden: true,
        areArtistsHidden: true,
        options: {
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              type: 'time',
              display: true,
              distribution: 'series',
              time: {
                unit: "month",
              }
            }],
            gridLines: {
              color: '#836aa1'
            }
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
            this.createDataset(searched)
            break;

          case "phrase":
            searched = this.searchedPhrase ? this.searchByPhrase(this.searchedPhrase) : this.soundcloud;
            this.createDataset(searched)
            break;
        }
        this.searchedData = searched;
      },
      clear: function () {
        this.searchedData = this.soundcloud;
      },
      str(text) {
        return latinize(text.toLowerCase())
      },
      hasUsername(entry, username) {
        return this.str(entry.track.user.permalink).includes(this.str(username)) 
            || this.str(entry.track.user.username).includes(this.str(username))
      },
      hasTrackTitle(entry, title) {
        return this.str(entry.track.title).includes(this.str(title));
      },
      searchByPhrase(phrase) {
        return this.soundcloud
          .filter(entry => entry.track && entry.track.user)
          .filter(entry => this.hasUsername(entry, phrase) || this.hasTrackTitle(entry, phrase))
      },
      searchByTag: function (tag) {
        return this.soundcloud
          .filter(entry => entry && entry.track && entry.track.genre)
          .filter(entry => this.str(entry.track.genre) == this.str(tag))
      },
      searchByDate: function (yearMonth) {
        return this.soundcloud
          .filter(entry => entry.created_at.includes(yearMonth))
      },
      createDataset: function (data) {
           var dataset = {};
        data
          .map(entry => entry.created_at.split("T")[0].slice(0, -3))
          .forEach(element => {
            if (!dataset[element]) {
              dataset[element] = {x: element + '-01', y: 0};
            }
            dataset[element].y += 1;
          });
        var datac = Object.values(dataset);
        this.tagAnalitics = {
          labels: [],
          datasets: [{
            label: 'Repost statistics',
            backgroundColor: 'rgba(81, 5, 180, 0.7)',
            data: datac
          }]
        }
      }
    },
    computed: {
      tagsStatistics: function () {
         var dataset = {};
         this.soundcloud
          .filter(entry => entry && entry.track && entry.track.genre)
          .map(entry => entry.track.genre.toLowerCase())
          .forEach(element => {
            if (!dataset[element]) {
              dataset[element] = {name: element, count: 0 };
            }
            dataset[element].count += 1;
          });
          var sorted = Object.values(dataset).sort((a,b) => b.count - a.count);
          return sorted
      },
      artistsStatistics: function () {
          var dataset = {};
         this.soundcloud
          .filter(entry => entry && entry.track && entry.track.user && entry.track.user.permalink)
          .map(entry => entry.track.user.permalink.toLowerCase())
          .forEach(element => {
            if (!dataset[element]) {
              dataset[element] = {name: element, count: 0 };
            }
            dataset[element].count += 1;
          });
          var top100 = Object.values(dataset).sort((a,b) => b.count - a.count).slice(0,100);
          console.log(top100)
          return top100
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