<svelte:head>
  <title>CubeRealm Chatbot</title>
  <meta name="description" content="CubeRealm chatbot command picker" />
</svelte:head>

<script>
  let number = $state(0);

  function onclick() {
    number += 1;
  }
</script>

<h1>CubeRealm Chatbot</h1>
<p>Welcome to the basic chatbot website.</p>
<p>
  Use the <a href="/commands">commands</a> page to preview the chatbot command picker.<br />
  <button {onclick}>Click {number}</button>
</p>
