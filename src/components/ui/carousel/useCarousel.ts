import type { UnwrapRefCarouselApi as CarouselApi, CarouselEmits, CarouselProps } from './interface';
import { createInjectionState } from '@vueuse/core';
import emblaCarouselVue from 'embla-carousel-vue';
import { useDirection } from 'reka-ui';
import { computed, onMounted, ref, toValue } from 'vue';

const [useProvideCarousel, useInjectCarousel] = createInjectionState(({ opts, orientation, plugins }: CarouselProps, emits: CarouselEmits) => {
	const configDir = useDirection();

	const emblaOptions = computed(() => {
		const resolvedOpts = toValue(opts) ?? {};
		const htmlDir = typeof document !== 'undefined' ? document.documentElement.getAttribute('dir') : null;
		const direction = resolvedOpts.direction ?? (htmlDir === 'rtl' || htmlDir === 'ltr' ? htmlDir : configDir.value);

		return {
			...resolvedOpts,
			axis: orientation === 'horizontal' ? ('x' as const) : ('y' as const),
			direction,
		};
	});

	const [emblaNode, emblaApi] = emblaCarouselVue(emblaOptions, plugins);

	function scrollPrev() {
		emblaApi.value?.scrollPrev();
	}
	function scrollNext() {
		emblaApi.value?.scrollNext();
	}

	const canScrollNext = ref(false);
	const canScrollPrev = ref(false);

	function onSelect(api: CarouselApi) {
		canScrollNext.value = api?.canScrollNext() || false;
		canScrollPrev.value = api?.canScrollPrev() || false;
	}

	onMounted(() => {
		if (!emblaApi.value) return;

		emblaApi.value?.on('init', onSelect);
		emblaApi.value?.on('reInit', onSelect);
		emblaApi.value?.on('select', onSelect);

		emits('init-api', emblaApi.value);
	});

	return { carouselRef: emblaNode, carouselApi: emblaApi, canScrollPrev, canScrollNext, scrollPrev, scrollNext, orientation };
});

function useCarousel() {
	const carouselState = useInjectCarousel();

	if (!carouselState) throw new Error('useCarousel must be used within a <Carousel />');

	return carouselState;
}

export { useCarousel, useProvideCarousel };
