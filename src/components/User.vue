<template>
  <div class="columns is-multiline">
    <div class="column is-12-mobile is-4-tablet">
      <figure class="image is-square cover-art">
        <NwImg class="is-rounded" alt="logo" :src="userData.avatar_url" />
      </figure>
    </div>
    <div class="column is-12-mobile is-8-tablet is-align-self-center">
      <a :href="userData.permalink_url" class="has-text-link-light has-background-black pl-1 pr-1" target="_blank"> {{ userData.first_name }} </a> <br/>
      <span class="has-text-link-light has-background-black pl-1 pr-1"> {{ userData.full_name }} </span> <br/>
      <span class="has-text-link-light has-background-black pl-1 pr-1"> {{ userData.city }} </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'User',
  props: {
    userData: Object
  }
}
</script>

