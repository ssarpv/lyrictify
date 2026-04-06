import "./SongDetailsForm.css";

/**
 * Song Details Form Component
 * Handles track name, artist, and lyrics inputs
 */
export const SongDetailsForm = ({ trackName, author, lyrics, onTrackChange, onAuthorChange, onLyricsChange }) => {
	return (
		<div className="form-section">
			<h2 className="section-title">Song Details</h2>

			<div className="input-group">
				<label htmlFor="TrackNameInput">Track Name</label>
				<input
					type="text"
					id="TrackNameInput"
					placeholder="Enter track name..."
					value={trackName}
					onChange={(e) => onTrackChange(e.target.value)}
				/>
			</div>

			<div className="input-group">
				<label htmlFor="AuthorInput">Artist</label>
				<input
					type="text"
					id="AuthorInput"
					placeholder="Enter artist name..."
					value={author}
					onChange={(e) => onAuthorChange(e.target.value)}
				/>
			</div>

			<div className="input-group">
				<label htmlFor="LyricsInput">Lyrics</label>
				<textarea
					id="LyricsInput"
					rows={4}
					placeholder="Enter lyrics, one line at a time..."
					value={lyrics}
					onChange={(e) => onLyricsChange(e.target.value)}
				/>
			</div>
		</div>
	);
};
