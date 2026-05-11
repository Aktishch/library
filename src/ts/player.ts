import { createError, getTimeFormat, hideScrollbar, isEn, showScrollbar } from '@utils'

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

const createPlayer = ({ id, playlist }: Player): void => {
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
      const use = status.querySelector('use') as SVGUseElement
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

      const handlePoster = async (requestUrl: string): Promise<void> => {
        await fetch(requestUrl)
          .then((response: Response): boolean => {
            return response.ok
          })
          .then((response: boolean): void => {
            if (response) {
              loader.classList.add('hidden')
            } else {
              loader.classList.remove('hidden')
              createError(isEn ? 'The path to the image is incorrect' : 'Путь к изображению указан неверно')
            }
          })
          .catch((error: string): void => createError(error))
      }

      const setComposition = (index: number): void => {
        const composition: Composition = playlist[index]

        if (artist) artist.innerText = composition.artist
        if (song) song.innerText = composition.song
        if (audio) audio.src = composition.audio

        if (poster) {
          handlePoster(composition.poster)
            .finally((): void => {
              poster.src = composition.poster
            })
            .catch((error: string): void => createError(error))
        }
      }

      const setCurrentComposition = (): void => {
        compositions.forEach((composition: HTMLButtonElement, key: number): void => {
          if (!composition) return

          const status = composition.querySelector('*[data-player-status]') as SVGElement
          const use = status.querySelector('use') as SVGUseElement

          if (audio.played)
            use.setAttribute('href', key === condition.index ? '/img/icons.svg#pause' : '/img/icons.svg#play')
          if (audio.paused) use.setAttribute('href', '/img/icons.svg#play')
        })
      }

      const setStatusComposition = (): void => {
        if (audio.paused) {
          audio.play()
          use.setAttribute('href', '/img/icons.svg#pause')
          setCurrentComposition()
          condition.status = true
        } else {
          audio.pause()
          use.setAttribute('href', '/img/icons.svg#play')
          setCurrentComposition()
          condition.status = false
        }
      }

      const setRandom = (): void => {
        if (player.dataset.player === 'random') condition.index = Math.floor(Math.random() * playlist.length)
      }

      const setNextComposition = (): void => {
        condition.index++

        if (condition.index > playlist.length - 1) condition.index = 0

        setRandom()
        setComposition(condition.index)
        setStatusComposition()
      }

      const setPrevComposition = (): void => {
        condition.index--

        if (condition.index < 0) condition.index = playlist.length - 1

        setRandom()
        setComposition(condition.index)
        setStatusComposition()
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

      const startProgress = (event: Event): void => {
        if ((event.target as HTMLDivElement).closest('[data-player-progress]')) {
          hideScrollbar()
          condition.active = true
        }
      }

      const endProgress = (): void => {
        showScrollbar()
        condition.active = false
      }

      const moveProgress = (event: Event): void => {
        event.stopPropagation()

        if (!condition.active) return
        if ((event.target as HTMLDivElement).closest('[data-player-controls]')) setProgress(event)
      }

      const setComplete = (complete: boolean): void => {
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

      const loadAudio = (event: Event): void => {
        switch (event.type) {
          case 'loadstart': {
            progress.classList.add('pointer-events-none', 'opacity-50')
            play.classList.add('pointer-events-none')
            loading.classList.remove('hidden')
            status.classList.add('hidden')
            setComplete(false)
            break
          }

          case 'loadeddata': {
            progress.classList.remove('pointer-events-none', 'opacity-50')
            play.classList.remove('pointer-events-none')
            loading.classList.add('hidden')
            status.classList.remove('hidden')
            setComplete(true)
            break
          }
        }
      }

      const setTiming = ({ type, time }: Timing): void => {
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

        time.innerText = `${getTimeFormat(Math.floor(timing / 60))}:${getTimeFormat(Math.floor(timing % 60))}`
      }

      const startAudio = (event: Event): void => {
        range.style.width = `${(audio.currentTime / audio.duration) * 100}%`
        setTiming({ type: event.type, time: start })
        condition.time = audio.currentTime
        saveStorage()
      }

      const endAudio = (): void => {
        audio.addEventListener('loadedmetadata', ((event: Event): void => {
          setTiming({ type: event.type, time: end })
        }) as EventListener)
      }

      const pauseAudio = (): void => {
        use.setAttribute('href', '/img/icons.svg#play')
        setCurrentComposition()
      }

      const setError = (): void => {
        createError(isEn ? 'Failed to load audio' : 'Не удалось загрузить аудио')
      }

      const setVolume = (): void => {
        const status = volume.querySelector('svg') as SVGSVGElement
        const use = status.querySelector('use') as SVGUseElement

        if (condition.muted) {
          status.classList.add('opacity-50')
          use.setAttribute('href', '/img/icons.svg#volume-off')
        } else {
          status.classList.remove('opacity-50')
          use.setAttribute('href', '/img/icons.svg#volume-on')
        }

        audio.muted = condition.muted
      }

      const setMuted = (): void => {
        condition.muted = condition.muted ? false : true
        saveStorage()
        setVolume()
      }

      const initializePlayer = (): void => {
        setComposition(condition.index)
        setVolume()
        audio.currentTime = condition.time

        if (condition.status) {
          setStatusComposition()

          if (audio.paused) pauseAudio()
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

            setStatusComposition()
          }) as EventListener)
        })
      }

      initializePlayer()
      play.addEventListener('click', setStatusComposition as EventListener)
      next.addEventListener('click', setNextComposition as EventListener)
      prev.addEventListener('click', setPrevComposition as EventListener)
      progress.addEventListener('click', setProgress as EventListener)
      player.addEventListener('mousedown', startProgress as EventListener)
      player.addEventListener('mouseup', endProgress as EventListener)
      player.addEventListener('mouseleave', endProgress as EventListener)
      player.addEventListener('mousemove', moveProgress as EventListener)
      player.addEventListener('touchstart', startProgress as EventListener, { passive: true })
      player.addEventListener('touchend', endProgress as EventListener, { passive: true })
      player.addEventListener('touchcancel', endProgress as EventListener, { passive: true })
      player.addEventListener('touchmove', moveProgress as EventListener, { passive: true })
      audio.addEventListener('loadstart', loadAudio as EventListener)
      audio.addEventListener('loadeddata', loadAudio as EventListener)
      audio.addEventListener('timeupdate', startAudio as EventListener)
      audio.addEventListener('timeupdate', endAudio as EventListener)
      audio.addEventListener('ended', setNextComposition as EventListener)
      audio.addEventListener('pause', pauseAudio as EventListener)
      audio.addEventListener('error', setError as EventListener)
      volume.addEventListener('click', setMuted as EventListener)
    })
    .catch((error: string): void => createError(error))
}

export default (): void => {
  createPlayer({ id: 'player', playlist })
  document.addEventListener('play', playOnlyOne as EventListener, true)
}
