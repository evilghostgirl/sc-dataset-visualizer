<template>
  <div class="columns is-multiline is-mobile">
    <div class="column is-4-mobile is-4-tablet">
      <figure class="image cover-art">
        <NwImg class="is-rounded" alt="logo" :src="userData.avatar_url"  style="max-width: 128px; max-height: 128px;"/>
      </figure>
    </div>
    <div class="column is-8-mobile is-8-tablet is-align-self-center">
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

