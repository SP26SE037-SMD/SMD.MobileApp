import { create } from 'zustand';

interface WishlistState {
    bookmarkedSubjects: string[];
    toggleBookmark: (id: string) => void;
    isBookmarked: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
    bookmarkedSubjects: [],

    toggleBookmark: (id) => {
        set((state) => {
            const isCurrentlyBookmarked = state.bookmarkedSubjects.includes(id);
            if (isCurrentlyBookmarked) {
                return {
                    bookmarkedSubjects: state.bookmarkedSubjects.filter((subjectId) => subjectId !== id),
                };
            } else {
                return {
                    bookmarkedSubjects: [...state.bookmarkedSubjects, id],
                };
            }
        });
    },

    isBookmarked: (id) => {
        return get().bookmarkedSubjects.includes(id);
    },
}));
