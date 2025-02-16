# Hugo Module: Board Game Geek

This is a [Hugo](https://gohugo.io) module to add pages for your tabletop games collection to your website. Details of your collection and the games are automatically collected from [Board Game Geek](https://boardgamegeek.com/) (BGG).

It was developed for my personal website to provide a more modern and mobile friendly user interface, with filtering capabilities based on attendees to gaming sessions.

**Note: I nor this module are associated with board game geek.**

> :warning: **This is not a theme module!** It will only add basic pages to your site for you game collection. The components are split which should hopefully allow you to re-style them as needed. This will be covered in the [Overriding Components](#overridingstyling-components) section. The screenshots below are an example where the basic styling has been overridden to use [Bootstrap](https://getbootstrap.com).

![A bootstrap styled game list page](./game-list.png)
![A bootstrap styled game page](./game-page.png)

## Features

- Game collection automatically added from BGG.
- Individual game information automatically added from BGG:
  - Title and description
  - Cover image
  - Gameplay information such as number of players, estimated play time, and minimum age
  - Links to tutorial videos
- Basic game list filtering on combinations of:
  - Title
  - Number of players
  - Play time
  - Minimum age
- Summary content view with basic game information

Want something extra which isn't covered above? Feel free to extend as you see fit, but please try contribute back if possible.

## Quick Start

> :warning: This guide will assume a yaml configuration format. If using another format, you will need to convert.

1. Ensure you have already set up a hugo site, configured to support hugo modules, and with your desired theme.
1. Set up your game collection at [Board Game Geek](https://boardgamegeek.com/).
1. Add this hugo module by adding the following to your hugo config file:

    ```yaml
    module:
      imports:
        - path: github.com/deosrc/hugo-module-bgg
    ```

1. Add your username to the site params:

    ```yaml
    params:
      bgg:
        username: <your-username>

1. As per the suggestion of BGG when using the API, add the "Powered by BGG" image to your footer. You may wish to only do this on pages generated by this module. For convenience, a partial has been included to achieve this:

    ```go
    {{ partial "powered-by-bgg.html" . }}
    ```

1. Build your site. Your games collection should be available in the `/tabletop-games/` section.

    > :warning: Occasionally your site build may fail with an error indicating that Board Game Geek is preparing your collection. This is a quirk of the BGG API. Usually re-running the build will successfully build the site. This quirk of the API may also result in your collection data being out of date. Unfortunately, the only solution to this is to wait for the BGG cache to expire.

### Enabling Game List Filtering

Due to the variations in Hugo themes, the game list filters if shown will likely not be functional. The instructions for this will vary, so this section will instead aim to show you what is required so that you can add the correct override.

1. Create a new layout override for the list page type. This will need to be placed at `/layouts/tabletop-games/list.html`.
1. Either in the new layout or globally for your site, ensure the script `/assets/js/tabletop-games-list-filter.js` is being loaded or bundled into the page.
1. For the content of the page, add the filter controls in the desired location:

    ```go
    {{ .Render "list-filters" }}
    ```

1. Then add the game list. **Make sure the data properties are present on the `.game-list-item` element!**

    ```go
    <ul class="game-list">
      {{ range .Pages.ByTitle }}
        {{ $gameInfo := partial "get-game-info.html" . }}
        <li class="game-list-item" data-title="{{ .Title }}"  data-players-min="{{ $gameInfo.players.min }}" data-players-max="{{ $gameInfo.players.max }}" data-playtime-min="{{ $gameInfo.playTimeMins.min }}" data-playtime-max="{{ $gameInfo.playTimeMins.max }}" data-minage="{{ $gameInfo.minAge }}">
          <a href="{{ .RelPermalink }}">
            {{ .Render "summary" }}
          </a>
        </li>
      {{ end }}
    </ul>
    ```

1. Build and test your site.

## Customization

To allow use with as many Hugo sites as possible, the module is designed to be highly customizable, and in a number of ways.

### Overriding/Styling Components

For most styling, the HTML of the various components will need adjusting to match the class names and other components of the theme you are using.

The easiest way to accomplish this, is to copy the relevant file from the `layouts` folder of this repository, then customize it as required.

The main content views are as follows:

- `single.html` - The page for individual games.
- `list.html` - The game list page.
- `list-filters.html` - The controls for the list filtering.
- `summary.html` - A brief overview of the game. By default includes the title, thumbnail, players, play time and minimum age.

Additionally, the following partials are available:

- `tabletop-game-list.html` - Outputs the game summary for the provided pages. The context pass to the partial must be a Pages object.

### Adding Collection Games Manually

It may be desirable to manually add a game to your collection. This can especially be the case if the collection provided by BGG is out of date due to caching.

To add a game manually, a default template is provided. It should be automatically used with the following command:

```bash
hugo new content/tabletop-games/<game-name>.md
```

To load all of the game details from BGG, modify the `gameInfo` property in the page front matter:

```yaml
gameInfo:
  bggId: <bgg-game-id>
  collectInfoFromBgg: true
```

### Adding Custom Games

The process for adding custom games is similar to [adding collection games manually](#adding-collection-games-manually), but specifies all of the game information in the front matter. The basic template for this should be provided when creating the markdown file using the command above.

> :warning: Unfortunately, due to limitations with Hugo content adapters, it is not possible to use the method to override the game information provided by Board Game Geek.

## Other Usage Examples

### Latest Games

> :warning: The BGG API doesn't provided a "date added" property for collections, despite it being available on the website. As a result, the dates for game pages is set to the "last modified" property. This can result in a game appearing in this "Latest Games" example if you make any changes to it within your collection (e.g. by rating it).

```go
{{ $gamePages := where .Site.RegularPages "Type" "tabletop-games" }}
{{ with $gamePages.ByDate.Reverse.Limit 4 }}
  <h2 class="mb-4">Latest Games</h2>
  {{ partial "tabletop-game-list.html" . }}
{{ end }}
```

### Display a Summary

This is available either as a shortcode or a partial:

```go
{{< tabletop-game-summary page="/tabletop-games/camel-up" >}}
```

```go
{{ with .Site.GetPage "/tabletop-games/camel-up" }}
  {{ partial "tabletop-game-summary-link" . }}
{{ else }}
  {{ warnf "Page %s not found" $page }}
{{ end }}
```
