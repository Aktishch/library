import { Container, getData, getTimeFormat, hideScrollbar, isEn, logError, showScrollbar, source } from '@utils'

interface CompositionOptions {
  artist: string
  song: string
  audio: string
  poster: string
}

interface PlayerOptions {
  container: Container
  playlist: CompositionOptions[]
}

interface ConditionOptions {
  index: number
  time: number
  status: boolean
  muted: boolean
  active: boolean
}

interface TimingOptions {
  type: string
  time: HTMLElement | null
}

const DATA_PLAYER = getData('player')
const DATA_LOADER = getData('loader')
const DATA_RANDOM = getData('random')
const HIDDEN_CLASSNAME = 'hidden'
const POINTER_CLASSNAME = 'pointer-events-none'
const OPACITY_CLASSNAME = 'opacity-50'
const LI_CLASSNAMES = ['flex', 'items-center', 'gap-2']

const playlist: CompositionOptions[] = [
  {
    artist: 'Slipknot',
    song: 'Snuff',
    audio:
      'https://mp3minusovki.com/music/fhvndfjwserjgt/247bab1c312b2335afe3f5c9b496a3d3/01d63b016f64e0739a9e3d2599b6521f.mp3',
    poster: `${source}/img/pictures/test.jpg`
  },
  {
    artist: 'System of a down',
    song: 'Lonely Day',
    audio: 'https://cdn1.shadam.net/uploads/files/2018-09/1536003683_system-of-a-down-lonely-day.mp3',
    poster: `${source}/img/pictures/test.jpg`
  },
  {
    artist: 'Scorpions',
    song: 'Slave Me',
    audio: 'https://ruo.morsmusic.org/load/941771577/Scorpions_-_Slave_Me_(musmore.com).mp3',
    poster: `${source}/img/pictures/test.jpg`
  }
]

const playOnlyOne = (event: Event) => {
  const audios = document.querySelectorAll('audio')

  if (!audios.length) return

  audios.forEach((audio) => {
    if (audio !== event.target) {
      audio.pause()
    }
  })
}

const handleErrorLoad = () => {
  logError(isEn ? 'Failed to load audio' : 'Не удалось загрузить аудио')
}

const createComposition = (composition: CompositionOptions) => {
  const li = document.createElement('li')

  li.classList.add(...LI_CLASSNAMES)
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

const initPlayer = ({ container, playlist }: PlayerOptions) => {
  const player: HTMLElement | null = container.querySelector(`*[${DATA_PLAYER}]`)

  if (!player) return

  const value = player.dataset.player

  if (!value) {
    logError(isEn ? `${DATA_PLAYER} is missing a value` : `У ${DATA_PLAYER} отсутствует значение`)
    return
  }

  const checkPlaylist = async () => {
    const listing: HTMLUListElement | null = player.querySelector(`*[${DATA_PLAYER}-listing]`)

    if (!listing) return

    if (playlist.length) {
      playlist.forEach((composition) => {
        listing.appendChild(createComposition(composition))
      })
    }
  }

  checkPlaylist()
    .finally(() => {
      const compositions = player.querySelectorAll<HTMLButtonElement>(`*[${DATA_PLAYER}-composition]`)
      const poster: HTMLImageElement | null = player.querySelector(`*[${DATA_PLAYER}-poster]`)
      const loader: HTMLDivElement | null = player.querySelector(`*[${DATA_LOADER}]`)
      const artist: HTMLHeadingElement | null = player.querySelector(`*[${DATA_PLAYER}-artist]`)
      const song: HTMLHeadingElement | null = player.querySelector(`*[${DATA_PLAYER}-song]`)
      const audio: HTMLAudioElement | null = player.querySelector(`*[${DATA_PLAYER}-audio]`)
      const progress: HTMLDivElement | null = player.querySelector(`*[${DATA_PLAYER}-progress]`)
      const range: HTMLDivElement | null = player.querySelector(`*[${DATA_PLAYER}-range]`)
      const play: HTMLButtonElement | null = player.querySelector(`*[${DATA_PLAYER}-play]`)
      const prev: HTMLButtonElement | null = player.querySelector(`*[${DATA_PLAYER}-prev]`)
      const next: HTMLButtonElement | null = player.querySelector(`*[${DATA_PLAYER}-next]`)
      const start: HTMLSpanElement | null = player.querySelector(`*[${DATA_PLAYER}-start]`)
      const end: HTMLSpanElement | null = player.querySelector(`*[${DATA_PLAYER}-end]`)
      const volume: HTMLButtonElement | null = player.querySelector(`*[${DATA_PLAYER}-volume]`)

      if (!audio || !progress || !range || !play) {
        logError(
          isEn
            ? `The ${DATA_PLAYER} does not have a ${DATA_PLAYER}-(audio, progress, range, play) child element`
            : `У ${DATA_PLAYER} отсутствует дочерний элемент ${DATA_PLAYER}-(audio, progress, range, play)`
        )
        return
      }

      const loading: SVGElement | null = play.querySelector(`*[${DATA_PLAYER}-loading]`)
      const status: SVGElement | null = play.querySelector(`*[${DATA_PLAYER}-status]`)
      const use = status ? status.querySelector('use') : null
      const condition: ConditionOptions = JSON.parse(
        sessionStorage.getItem(value) ||
          JSON.stringify({
            index: 0,
            time: 0,
            status: false,
            muted: false,
            active: false
          })
      )

      const saveStorage = () => {
        sessionStorage.setItem(value, JSON.stringify(condition))
      }

      const handlePoster = async (requestUrl: string) => {
        try {
          const response = await fetch(requestUrl, { method: 'HEAD' })

          if (loader) {
            if (!response.ok) {
              loader.classList.remove(HIDDEN_CLASSNAME)
              throw isEn ? 'The path to the image is incorrect' : 'Путь к изображению указан неверно'
            }

            loader.classList.add(HIDDEN_CLASSNAME)
          }
        } catch (error) {
          logError(error as string)
        }
      }

      const setComposition = (index: number) => {
        const composition = playlist[index]

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
          handlePoster(composition.poster).finally(() => {
            poster.src = composition.poster
          })
        }
      }

      const setCurrentComposition = () => {
        if (!compositions.length) return

        compositions.forEach((composition, key) => {
          const status: SVGElement | null = composition.querySelector(`*[${DATA_PLAYER}-status]`)
          const use = status ? status.querySelector('use') : null

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

      const setStatusComposition = () => {
        if (audio.paused) {
          audio.play().catch((error: string) => {
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

      const setRandom = () => {
        if (player.hasAttribute(DATA_RANDOM)) {
          condition.index = Math.floor(Math.random() * playlist.length)
        }
      }

      const setNextComposition = () => {
        condition.index++

        if (condition.index > playlist.length - 1) {
          condition.index = 0
        }

        setRandom()
        setComposition(condition.index)
        setStatusComposition()
      }

      const setPrevComposition = () => {
        condition.index--

        if (condition.index < 0) {
          condition.index = playlist.length - 1
        }

        setRandom()
        setComposition(condition.index)
        setStatusComposition()
      }

      const setProgress = (event: Event) => {
        const { width, left } = progress.getBoundingClientRect()
        const clientX = 'touches' in event ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX

        audio.currentTime = ((clientX - left) / width) * audio.duration
      }

      const onStart = (event: Event) => {
        if ((event.target as HTMLElement).closest(`[${DATA_PLAYER}-progress]`)) {
          hideScrollbar()
          condition.active = true
        }
      }

      const onEnd = () => {
        showScrollbar()
        condition.active = false
      }

      const onMove = (event: Event) => {
        event.stopPropagation()

        if (!condition.active) return

        if ((event.target as HTMLElement).closest(`[${DATA_PLAYER}-controls]`)) {
          setProgress(event)
        }
      }

      const setComplete = (complete: boolean) => {
        if (!compositions.length) return

        compositions.forEach((composition, key) => {
          const loading: SVGElement | null = composition.querySelector(`*[${DATA_PLAYER}-loading]`)
          const status: SVGElement | null = composition.querySelector(`*[${DATA_PLAYER}-status]`)

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

      const loadAudio = (event: Event) => {
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

      const setTiming = ({ type, time }: TimingOptions) => {
        if (!time) return

        let timing = 0

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

      const startAudio = (event: Event) => {
        range.style.width = `${(audio.currentTime / audio.duration) * 100}%`
        setTiming({ type: event.type, time: start })
        condition.time = audio.currentTime
        saveStorage()
      }

      const endAudio = () => {
        const onLoadedMetaData = (event: Event) => {
          setTiming({ type: event.type, time: end })
        }

        audio.addEventListener('loadedmetadata', onLoadedMetaData)
      }

      const pauseAudio = () => {
        use?.setAttribute('href', `${source}/img/icons.svg#play`)
        setCurrentComposition()
      }

      const setVolume = () => {
        if (!volume) return

        const status = volume.querySelector('svg')
        const use = status ? status.querySelector('use') : null

        if (condition.muted) {
          status?.classList.add(OPACITY_CLASSNAME)
          use?.setAttribute('href', `${source}/img/icons.svg#volume-off`)
        } else {
          status?.classList.remove(OPACITY_CLASSNAME)
          use?.setAttribute('href', `${source}/img/icons.svg#volume-on`)
        }

        audio.muted = condition.muted
      }

      const setMuted = () => {
        condition.muted = condition.muted ? false : true
        saveStorage()
        setVolume()
      }

      const activatePlayer = () => {
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
          compositions.forEach((composition, key) => {
            const onClickComposition = () => {
              if (key !== condition.index) {
                condition.index = key
                setComposition(condition.index)
              }

              setStatusComposition()
            }

            composition.addEventListener('click', onClickComposition)
          })
        }
      }

      activatePlayer()
      play.addEventListener('click', setStatusComposition)
      next?.addEventListener('click', setNextComposition)
      prev?.addEventListener('click', setPrevComposition)
      progress.addEventListener('click', setProgress)
      player.addEventListener('mousedown', onStart)
      player.addEventListener('mouseup', onEnd)
      player.addEventListener('mouseleave', onEnd)
      player.addEventListener('mousemove', onMove)
      player.addEventListener('touchstart', onStart, { passive: true })
      player.addEventListener('touchend', onEnd, { passive: true })
      player.addEventListener('touchcancel', onEnd, { passive: true })
      player.addEventListener('touchmove', onMove, { passive: true })
      audio.addEventListener('loadstart', loadAudio)
      audio.addEventListener('loadeddata', loadAudio)
      audio.addEventListener('timeupdate', startAudio)
      audio.addEventListener('timeupdate', endAudio)
      audio.addEventListener('ended', setNextComposition)
      audio.addEventListener('pause', pauseAudio)
      audio.addEventListener('error', handleErrorLoad)
      volume?.addEventListener('click', setMuted)
    })
    .catch((error: string) => {
      logError(error)
    })
}

export default (container: Container = document) => {
  initPlayer({ container, playlist })
  container.addEventListener('play', playOnlyOne)
}
