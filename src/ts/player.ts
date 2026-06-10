import { Container, getData, getTimeFormat, hideScrollbar, isEn, logError, showScrollbar, source } from '@utils'

type Player = HTMLElement | null
type Value = string | undefined
type Listing = HTMLUListElement | null
type Poster = HTMLImageElement | null
type Loader = HTMLDivElement | null
type PlayerItem = HTMLElement | null
type Audio = HTMLAudioElement | null
type Button = HTMLButtonElement | null
type Icon = SVGElement | null
type Use = SVGUseElement | null

interface Composition {
  artist: string
  song: string
  audio: string
  poster: string
}

interface PlayerOptions {
  container: Container
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
  time: HTMLElement | null
}

const DATA_PLAYER: string = getData('player')
const HIDDEN_CLASSNAME: string = 'hidden'
const POINTER_CLASSNAME: string = 'pointer-events-none'
const OPACITY_CLASSNAME: string = 'opacity-50'

const playlist: Composition[] = [
  {
    artist: 'Slipknot',
    song: 'Snuff',
    audio:
      'https://mp3minusovki.com/music/fhvndfjwserjgt/247bab1c312b2335afe3f5c9b496a3d3/01d63b016f64e0739a9e3d2599b6521f.mp3',
    poster: `${source}/img/pictures/town.jpg`
  },
  {
    artist: 'System of a down',
    song: 'Lonely Day',
    audio: 'https://cdn1.shadam.net/uploads/files/2018-09/1536003683_system-of-a-down-lonely-day.mp3',
    poster: `${source}/img/pictures/town.jpg`
  },
  {
    artist: 'Scorpions',
    song: 'Slave Me',
    audio: 'https://ruo.morsmusic.org/load/941771577/Scorpions_-_Slave_Me_(musmore.com).mp3',
    poster: `${source}/img/pictures/town.jpg`
  }
]

const playOnlyOne = (event: Event): void => {
  const audios: NodeListOf<HTMLAudioElement> = document.querySelectorAll('audio')

  if (!audios.length) return

  audios.forEach((audio: HTMLAudioElement): void => {
    if (audio !== event.target) {
      audio.pause()
    }
  })
}

const handleErrorLoad = (): void => {
  logError(isEn ? 'Failed to load audio' : 'Не удалось загрузить аудио')
}

const handleValueError = (): void => {
  logError(isEn ? `${DATA_PLAYER} is missing a value` : `У ${DATA_PLAYER} отсутствует значение`)
}

const handleElementsError = (): void => {
  logError(
    isEn
      ? `The ${DATA_PLAYER} does not have a ${DATA_PLAYER}-(audio, progress, range, play) child element`
      : `У ${DATA_PLAYER} отсутствует дочерний элемент ${DATA_PLAYER}-(audio, progress, range, play)`
  )
}

const createComposition = (composition: Composition): HTMLLIElement => {
  const li: HTMLLIElement = document.createElement('li')

  li.classList.add('flex', 'items-center', 'gap-2')
  li.innerHTML = `
    <button class="btn btn-primary btn-fade text-4xl rounded-full shrink-0 size-10" ${DATA_PLAYER}-composition data-waved="dark">
      <svg class="loading icon hidden" ${DATA_PLAYER}-loading>
        <use href="${source}/img/icons.svg#loading"></use>
      </svg>
      <svg class="icon" ${DATA_PLAYER}-status>
        <use href="${source}/img/icons.svg#play"></use>
      </svg>
    </button>
    <div class="flex flex-col">
      <span class="font-semibold text-xl">${composition.artist}</span>
      <span class="opacity-70">${composition.song}</span>
    </div>
  `

  return li
}

const initPlayer = ({ container, playlist }: PlayerOptions): void => {
  const player: Player = container.querySelector(`*[${DATA_PLAYER}]`)

  if (!player) return

  const value: Value = player.dataset.player

  if (!value) {
    handleValueError()
    return
  }

  const checkPlaylist = async (): Promise<void> => {
    const listing: Listing = player.querySelector(`*[${DATA_PLAYER}-listing]`)

    if (!listing) return

    if (playlist.length) {
      playlist.forEach((composition: Composition): void => {
        listing.appendChild(createComposition(composition))
      })
    }
  }

  checkPlaylist()
    .finally((): void => {
      const compositions: NodeListOf<HTMLButtonElement> = player.querySelectorAll(`*[${DATA_PLAYER}-composition]`)
      const poster: Poster = player.querySelector(`*[${DATA_PLAYER}-poster]`)
      const loader: Loader = player.querySelector('*[data-loader]')
      const artist: PlayerItem = player.querySelector(`*[${DATA_PLAYER}-artist]`)
      const song: PlayerItem = player.querySelector(`*[${DATA_PLAYER}-song]`)
      const audio: Audio = player.querySelector(`*[${DATA_PLAYER}-audio]`)
      const progress: PlayerItem = player.querySelector(`*[${DATA_PLAYER}-progress]`)
      const range: PlayerItem = player.querySelector(`*[${DATA_PLAYER}-range]`)
      const play: Button = player.querySelector(`*[${DATA_PLAYER}-play]`)
      const prev: Button = player.querySelector(`*[${DATA_PLAYER}-prev]`)
      const next: Button = player.querySelector(`*[${DATA_PLAYER}-next]`)
      const start: PlayerItem = player.querySelector(`*[${DATA_PLAYER}-start]`)
      const end: PlayerItem = player.querySelector(`*[${DATA_PLAYER}-end]`)
      const volume: Button = player.querySelector(`*[${DATA_PLAYER}-volume]`)

      if (!audio || !progress || !range || !play) {
        handleElementsError()
        return
      }

      const loading: Icon = play.querySelector(`*[${DATA_PLAYER}-loading]`)
      const status: Icon = play.querySelector(`*[${DATA_PLAYER}-status]`)
      const use: Use = status ? status.querySelector('use') : null
      const condition: Condition = JSON.parse(
        sessionStorage.getItem(value) ||
          JSON.stringify({
            index: 0,
            time: 0,
            status: false,
            muted: false,
            active: false
          })
      )

      const saveStorage = (): void => {
        sessionStorage.setItem(value, JSON.stringify(condition))
      }

      const handlePoster = async (requestUrl: string): Promise<void> => {
        try {
          const response: Response = await fetch(requestUrl, { method: 'HEAD' })

          if (loader) {
            if (!response.ok) {
              loader.classList.remove(HIDDEN_CLASSNAME)
              throw isEn ? 'The path to the image is incorrect' : 'Путь к изображению указан неверно'
            }

            loader.classList.add(HIDDEN_CLASSNAME)
          }
        } catch (error: unknown) {
          logError(error as string)
        }
      }

      const setComposition = (index: number): void => {
        const composition: Composition = playlist[index]

        if (artist) {
          artist.innerText = composition.artist
        }

        if (song) {
          song.innerText = composition.song
        }

        if (audio) {
          audio.src = composition.audio
        }

        if (poster) {
          handlePoster(composition.poster).finally((): void => {
            poster.src = composition.poster
          })
        }
      }

      const setCurrentComposition = (): void => {
        if (!compositions.length) return

        compositions.forEach((composition: HTMLButtonElement, key: number): void => {
          const status: Icon = composition.querySelector(`*[${DATA_PLAYER}-status]`)
          const use: Use = status ? status.querySelector('use') : null

          if (!use) return

          if (audio.played) {
            use.setAttribute(
              'href',
              key === condition.index ? `${source}/img/icons.svg#pause` : `${source}/img/icons.svg#play`
            )
          }

          if (audio.paused) {
            use.setAttribute('href', `${source}/img/icons.svg#play`)
          }
        })
      }

      const setStatusComposition = (): void => {
        if (audio.paused) {
          audio.play().catch((error: string): void => {
            logError(error)
          })

          use?.setAttribute('href', `${source}/img/icons.svg#pause`)
          setCurrentComposition()
          condition.status = true
        } else {
          audio.pause()
          use?.setAttribute('href', `${source}/img/icons.svg#play`)
          setCurrentComposition()
          condition.status = false
        }
      }

      const setRandom = (): void => {
        if (player.hasAttribute('data-random')) {
          condition.index = Math.floor(Math.random() * playlist.length)
        }
      }

      const setNextComposition = (): void => {
        condition.index++

        if (condition.index > playlist.length - 1) {
          condition.index = 0
        }

        setRandom()
        setComposition(condition.index)
        setStatusComposition()
      }

      const setPrevComposition = (): void => {
        condition.index--

        if (condition.index < 0) {
          condition.index = playlist.length - 1
        }

        setRandom()
        setComposition(condition.index)
        setStatusComposition()
      }

      const setProgress = (event: Event): void => {
        const { width, left } = progress.getBoundingClientRect()
        const duration: number = audio.duration
        const offsetX: number =
          'touches' in event ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX

        audio.currentTime = ((offsetX - left) / width) * duration
      }

      const onStart = (event: Event): void => {
        if ((event.target as HTMLElement).closest(`[${DATA_PLAYER}-progress]`)) {
          hideScrollbar()
          condition.active = true
        }
      }

      const onEnd = (): void => {
        showScrollbar()
        condition.active = false
      }

      const onMove = (event: Event): void => {
        event.stopPropagation()

        if (!condition.active) return

        if ((event.target as HTMLElement).closest(`[${DATA_PLAYER}-controls]`)) {
          setProgress(event)
        }
      }

      const setComplete = (complete: boolean): void => {
        if (!compositions.length) return

        compositions.forEach((composition: HTMLButtonElement, key: number): void => {
          const loading: Icon = composition.querySelector(`*[${DATA_PLAYER}-loading]`)
          const status: Icon = composition.querySelector(`*[${DATA_PLAYER}-status]`)

          if (!complete && key === condition.index) {
            composition.classList.add(POINTER_CLASSNAME)
            loading?.classList.remove(HIDDEN_CLASSNAME)
            status?.classList.add(HIDDEN_CLASSNAME)
          } else {
            composition.classList.remove(POINTER_CLASSNAME)
            loading?.classList.add(HIDDEN_CLASSNAME)
            status?.classList.remove(HIDDEN_CLASSNAME)
          }
        })
      }

      const loadAudio = (event: Event): void => {
        switch (event.type) {
          case 'loadstart': {
            progress.classList.add(POINTER_CLASSNAME, OPACITY_CLASSNAME)
            play.classList.add(POINTER_CLASSNAME)
            loading?.classList.remove(HIDDEN_CLASSNAME)
            status?.classList.add(HIDDEN_CLASSNAME)
            setComplete(false)
            break
          }

          case 'loadeddata': {
            progress.classList.remove(POINTER_CLASSNAME, OPACITY_CLASSNAME)
            play.classList.remove(POINTER_CLASSNAME)
            loading?.classList.add(HIDDEN_CLASSNAME)
            status?.classList.remove(HIDDEN_CLASSNAME)
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
        const onLoadedMetaData = (event: Event): void => {
          setTiming({ type: event.type, time: end })
        }

        audio.addEventListener('loadedmetadata', onLoadedMetaData as EventListener)
      }

      const pauseAudio = (): void => {
        use?.setAttribute('href', `${source}/img/icons.svg#play`)
        setCurrentComposition()
      }

      const setVolume = (): void => {
        if (!volume) return

        const status: Icon = volume.querySelector('svg')
        const use: Use = status ? status.querySelector('use') : null

        if (condition.muted) {
          status?.classList.add(OPACITY_CLASSNAME)
          use?.setAttribute('href', `${source}/img/icons.svg#volume-off`)
        } else {
          status?.classList.remove(OPACITY_CLASSNAME)
          use?.setAttribute('href', `${source}/img/icons.svg#volume-on`)
        }

        audio.muted = condition.muted
      }

      const setMuted = (): void => {
        condition.muted = condition.muted ? false : true
        saveStorage()
        setVolume()
      }

      const activatePlayer = (): void => {
        setComposition(condition.index)
        setVolume()
        audio.currentTime = condition.time

        if (condition.status) {
          setStatusComposition()

          if (audio.paused) {
            pauseAudio()
          }
        }

        if (start) {
          start.innerText = '00:00'
        }

        if (end) {
          end.innerText = '00:00'
        }

        if (compositions.length) {
          compositions.forEach((composition: HTMLButtonElement, key: number): void => {
            const onClickComposition = (): void => {
              if (key !== condition.index) {
                condition.index = key
                setComposition(condition.index)
              }

              setStatusComposition()
            }

            composition.addEventListener('click', onClickComposition as EventListener)
          })
        }
      }

      activatePlayer()
      play.addEventListener('click', setStatusComposition as EventListener)
      next?.addEventListener('click', setNextComposition as EventListener)
      prev?.addEventListener('click', setPrevComposition as EventListener)
      progress.addEventListener('click', setProgress as EventListener)
      player.addEventListener('mousedown', onStart as EventListener)
      player.addEventListener('mouseup', onEnd as EventListener)
      player.addEventListener('mouseleave', onEnd as EventListener)
      player.addEventListener('mousemove', onMove as EventListener)
      player.addEventListener('touchstart', onStart as EventListener, { passive: true })
      player.addEventListener('touchend', onEnd as EventListener, { passive: true })
      player.addEventListener('touchcancel', onEnd as EventListener, { passive: true })
      player.addEventListener('touchmove', onMove as EventListener, { passive: true })
      audio.addEventListener('loadstart', loadAudio as EventListener)
      audio.addEventListener('loadeddata', loadAudio as EventListener)
      audio.addEventListener('timeupdate', startAudio as EventListener)
      audio.addEventListener('timeupdate', endAudio as EventListener)
      audio.addEventListener('ended', setNextComposition as EventListener)
      audio.addEventListener('pause', pauseAudio as EventListener)
      audio.addEventListener('error', handleErrorLoad as EventListener)
      volume?.addEventListener('click', setMuted as EventListener)
    })
    .catch((error: string): void => {
      logError(error)
    })
}

export default (container: Container = document): void => {
  initPlayer({ container, playlist })
  container.addEventListener('play', playOnlyOne as EventListener, true)
}
