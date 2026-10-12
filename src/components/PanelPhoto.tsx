import type { HomePhoto } from '@/lib/home-photos';

export function PanelPhoto({ photo, eager = false }: { photo: HomePhoto; eager?: boolean }) {
  return (
    <img
      className="panel-photo"
      src={photo.src}
      srcSet={photo.srcSet}
      sizes="100vw"
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      decoding="async"
      {...(eager ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })}
    />
  );
}

export function PanelCredit({ photo }: { photo: HomePhoto }) {
  return (
    <p className="panel-credit">
      Illustrative photo by <a href={photo.href}>{photo.credit}</a> on {photo.source}. {photo.note}
    </p>
  );
}
