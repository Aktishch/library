import { createError, en, scrollbarHidden, scrollbarShow, timeFormat } from '@utils'

interface Composition {
  artist: string
  song: string
  audio: string
  poster: string
}

interface Player {
  id: string
  playlist: Composition[]
}

interface Condition {
  index: number
  time: number
  status: boolean
  muted: boolean
  active: boolean
}

interface Timing {
  type: string
  time: HTMLSpanElement
}

const playlist: Composition[] = [
  {
    artist: 'Slipknot',
    song: 'Snuff',
    audio:
      'https://mp3minusovki.com/music/fhvndfjwserjgt/247bab1c312b2335afe3f5c9b496a3d3/01d63b016f64e0739a9e3d2599b6521f.mp3',
    poster: '/img/pictures/town.jpg',
  },
  {
    artist: 'System of a down',
    song: 'Lonely Day',
    audio: 'https://cdn1.shadam.net/uploads/files/2018-09/1536003683_system-of-a-down-lonely-day.mp3',
    poster: '/img/pictures/town.jpg',
  },
  {
    artist: 'Scorpions',
    song: 'Slave Me',
    audio: 'https://ruo.morsmusic.org/load/941771577/Scorpions_-_Slave_Me_(musmore.com).mp3',
    poster: '/img/pictures/town.jpg',
  },
]

const playOnlyOne = (event: Event): void => {
  const audios = document.querySelectorAll('audio') as NodeListOf<HTMLAudioElement>

  for (let i: number = 0; i < audios.length; i++) {
    const audio = audios[i] as HTMLAudioElement

    if (audio !== event.target) audio.pause()
  }
}

const createComposition = (composition: Composition): HTMLLIElement => {
  const item = document.createElement('li') as HTMLLIElement

  item.classList.add('flex', 'items-center', 'gap-2')
  item.innerHTML = `
    <button class="btn btn-primary btn-fade text-4xl rounded-full shrink-0 size-10" data-player-composition data-waved="dark">
      <svg class="loading icon hidden" data-player-loading>
        <use href="/img/icons.svg#loading"></use>
      </svg>
      <svg class="icon" data-player-status>
        <use href="/img/icons.svg#play"></use>
      </svg>
    </button>
    <div class="flex flex-col">
      <span class="font-semibold text-xl">${composition.artist}</span>
      <span class="opacity-70">${composition.song}</span>
    </div>
  `

  return item
}

const setPlayer = ({ id, playlist }: Player): void => {
  const player = document.getElementById(id) as HTMLElement

  if (!player) return

  const createPlaylist = async (): Promise<void> => {
    const listing = player.querySelector('*[data-player-listing]') as HTMLUListElement

    if (!listing) return

    playlist.forEach((composition: Composition): void => {
      if (composition) listing.appendChild(createComposition(composition))
    })
  }

  createPlaylist()
    .finally((): void => {
      const compositions = player.querySelectorAll('*[data-player-composition]') as NodeListOf<HTMLButtonElement>
      const poster = player.querySelector('*[data-player-poster]') as HTMLImageElement
      const loader = player.querySelector('*[data-loader]') as HTMLDivElement
      const artist = player.querySelector('*[data-player-artist]') as HTMLElement
      const song = player.querySelector('*[data-player-song]') as HTMLElement
      const audio = player.querySelector('*[data-player-audio]') as HTMLAudioElement
      const progress = player.querySelector('*[data-player-progress]') as HTMLDivElement
      const range = player.querySelector('*[data-player-range]') as HTMLDivElement
      const play = player.querySelector('*[data-player-play]') as HTMLButtonElement
      const loading = play.querySelector('*[data-player-loading]') as SVGElement
      const status = play.querySelector('*[data-player-status]') as SVGElement
      const icon = status.querySelector('use') as SVGUseElement
      const prev = player.querySelector('*[data-player-prev]') as HTMLButtonElement
      const next = player.querySelector('*[data-player-next]') as HTMLButtonElement
      const start = player.querySelector('*[data-player-start]') as HTMLSpanElement
      const end = player.querySelector('*[data-player-end]') as HTMLSpanElement
      const volume = player.querySelector('*[data-player-volume]') as HTMLButtonElement
      const condition: Condition = JSON.parse(
        sessionStorage.getItem(id) ||
          JSON.stringify({
            index: 0,
            time: 0,
            status: false,
            muted: false,
            active: false,
          })
      )

      const saveStorage = (): void => sessionStorage.setItem(id, JSON.stringify(condition))

      const loadPoster = async (requestUrl: string): Promise<void> => {
        await fetch(requestUrl)
          .then((response: Response): Promise<Blob> | null => {
            return response.ok ? response.blob() : null
          })
          .then((blob: Blob | null): void => {
            blob && requestUrl !== '' ? loader.classList.add('hidden') : loader.classList.remove('hidden')
          })
          .catch((error: string): void => createError(error))
      }

      const setComposition = (index: number): void => {
        const composition: Composition = playlist[index]

        if (artist) artist.innerText = composition.artist
        if (song) song.innerText = composition.song
        if (audio) audio.src = composition.audio

        if (poster) {
          loadPoster(composition.poster)
            .finally((): void => {
              poster.src = composition.poster
            })
            .catch((error: string): void => createError(error))
        }
      }

      const currentComposition = (): void => {
        compositions.forEach((composition: HTMLButtonElement, key: number): void => {
          if (!composition) return

          const status = composition.querySelector('*[data-player-status]') as SVGElement
          const icon = status.querySelector('use') as SVGUseElement

          if (audio.played)
            icon.setAttribute('href', key === condition.index ? '/img/icons.svg#pause' : '/img/icons.svg#play')
          if (audio.paused) icon.setAttribute('href', '/img/icons.svg#play')
        })
      }

      const statusComposition = (): void => {
        if (audio.paused) {
          audio.play()
          icon.setAttribute('href', '/img/icons.svg#pause')
          currentComposition()
          condition.status = true
        } else {
          audio.pause()
          icon.setAttribute('href', '/img/icons.svg#play')
          currentComposition()
          condition.status = false
        }
      }

      const randomComposition = (): void => {
        if (player.dataset.player === 'random') condition.index = Math.floor(Math.random() * playlist.length)
      }

      const nextComposition = (): void => {
        condition.index++

        if (condition.index > playlist.length - 1) condition.index = 0

        randomComposition()
        setComposition(condition.index)
        statusComposition()
      }

      const prevComposition = (): void => {
        condition.index--

        if (condition.index < 0) condition.index = playlist.length - 1

        randomComposition()
        setComposition(condition.index)
        statusComposition()
      }

      const setProgress = (event: Event): void => {
        const width: number = progress.clientWidth
        const duration: number = audio.duration
        let offsetX: number = 0

        if (event.type === 'click' || event.type === 'mousemove') {
          offsetX = (event as MouseEvent).offsetX
        } else if (event.type === 'touchmove') {
          for (let i: number = 0; i < (event as TouchEvent).changedTouches.length; i++) {
            offsetX = (event as TouchEvent).changedTouches[i].pageX - progress.getBoundingClientRect().left
          }
        }

        audio.currentTime = (offsetX / width) * duration
      }

      const progressStart = (event: Event): void => {
        if ((event.target as HTMLDivElement).closest('[data-player-progress]')) {
          scrollbarHidden()
          condition.active = true
        }
      }

      const progressEnd = (): void => {
        scrollbarShow()
        condition.active = false
      }

      const progressMove = (event: Event): void => {
        event.stopPropagation()

        if (!condition.active) return
        if ((event.target as HTMLDivElement).closest('[data-player-controls]')) setProgress(event)
      }

      const compositionLoad = (complete: boolean): void => {
        compositions.forEach((composition: HTMLButtonElement, key: number): void => {
          if (!composition) return

          const loading = composition.querySelector('*[data-player-loading]') as SVGElement
          const status = composition.querySelector('*[data-player-status]') as SVGElement

          if (!complete && key === condition.index) {
            composition.classList.add('pointer-events-none')
            loading.classList.remove('hidden')
            status.classList.add('hidden')
          } else {
            composition.classList.remove('pointer-events-none')
            loading.classList.add('hidden')
            status.classList.remove('hidden')
          }
        })
      }

      const audioLoad = (event: Event): void => {
        switch (event.type) {
          case 'loadstart': {
            progress.classList.add('pointer-events-none', 'opacity-50')
            play.classList.add('pointer-events-none')
            loading.classList.remove('hidden')
            status.classList.add('hidden')
            compositionLoad(false)
            break
          }

          case 'loadeddata': {
            progress.classList.remove('pointer-events-none', 'opacity-50')
            play.classList.remove('pointer-events-none')
            loading.classList.add('hidden')
            status.classList.remove('hidden')
            compositionLoad(true)
            break
          }
        }
      }

      const audioTiming = ({ type, time }: Timing): void => {
        if (!time) return

        let timing: number = 0

        switch (type) {
          case 'timeupdate': {
            timing = audio.currentTime
            break
          }

          case 'loadedmetadata': {
            timing = audio.duration
            break
          }
        }

        time.innerText = `${timeFormat(Math.floor(timing / 60))}:${timeFormat(Math.floor(timing % 60))}`
      }

      const audioStart = (event: Event): void => {
        range.style.width = `${(audio.currentTime / audio.duration) * 100}%`
        audioTiming({ type: event.type, time: start })
        condition.time = audio.currentTime
        saveStorage()
      }

      const audioEnd = (): void => {
        audio.addEventListener('loadedmetadata', ((event: Event): void => {
          audioTiming({ type: event.type, time: end })
        }) as EventListener)
      }

      const audioPause = (): void => {
        icon.setAttribute('href', '/img/icons.svg#play')
        currentComposition()
      }

      const audioError = (): void => {
        createError(en ? 'Failed to load audio' : 'Не удалось загрузить аудио')
      }

      const volumeState = (): void => {
        const status = volume.querySelector('svg') as SVGSVGElement
        const icon = status.querySelector('use') as SVGUseElement

        if (condition.muted) {
          status.classList.add('opacity-50')
          icon.setAttribute('href', '/img/icons.svg#volume-off')
        } else {
          status.classList.remove('opacity-50')
          icon.setAttribute('href', '/img/icons.svg#volume-on')
        }

        audio.muted = condition.muted
      }

      const mutedState = (): void => {
        condition.muted = condition.muted ? false : true
        saveStorage()
        volumeState()
      }

      const playerInit = (): void => {
        setComposition(condition.index)
        volumeState()
        audio.currentTime = condition.time

        if (condition.status) {
          statusComposition()

          if (audio.paused) audioPause()
        }

        if (start) start.innerText = '00:00'
        if (end) end.innerText = '00:00'

        compositions.forEach((composition: HTMLButtonElement, key: number): void => {
          if (!composition) return

          composition.addEventListener('click', ((): void => {
            if (key !== condition.index) {
              condition.index = key
              setComposition(condition.index)
            }

            statusComposition()
          }) as EventListener)
        })
      }

      playerInit()

      play.addEventListener('click', statusComposition as EventListener)
      next.addEventListener('click', nextComposition as EventListener)
      prev.addEventListener('click', prevComposition as EventListener)
      progress.addEventListener('click', setProgress as EventListener)
      player.addEventListener('mousedown', progressStart as EventListener)
      player.addEventListener('mouseup', progressEnd as EventListener)
      player.addEventListener('mouseleave', progressEnd as EventListener)
      player.addEventListener('mousemove', progressMove as EventListener)
      player.addEventListener('touchstart', progressStart as EventListener, { passive: true })
      player.addEventListener('touchend', progressEnd as EventListener, { passive: true })
      player.addEventListener('touchcancel', progressEnd as EventListener, { passive: true })
      player.addEventListener('touchmove', progressMove as EventListener, { passive: true })
      audio.addEventListener('loadstart', audioLoad as EventListener)
      audio.addEventListener('loadeddata', audioLoad as EventListener)
      audio.addEventListener('timeupdate', audioStart as EventListener)
      audio.addEventListener('timeupdate', audioEnd as EventListener)
      audio.addEventListener('ended', nextComposition as EventListener)
      audio.addEventListener('pause', audioPause as EventListener)
      audio.addEventListener('error', audioError as EventListener)
      volume.addEventListener('click', mutedState as EventListener)
    })
    .catch((error: string): void => createError(error))
}

export default (): void => {
  setPlayer({ id: 'player', playlist })
  document.addEventListener('play', playOnlyOne as EventListener, true)
}
