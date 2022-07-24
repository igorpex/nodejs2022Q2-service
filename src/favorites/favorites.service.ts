import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Album } from 'src/albums/entities/album.entity';
import { validate, version } from 'uuid';
import { db } from 'src/data/db';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { equals } from 'class-validator';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}
  // private favTracks: Array<string> = [];
  // private favArtists: Array<string> = [];
  // private favAlbums: Array<string> = [];

  async findAll() {
    // return `This action returns all favorites`;
    const favorites = await this.prisma.favorites.findMany();
    const tracksList = favorites
      .filter((favorite) => favorite.trackId !== null)
      .map((favorite) => favorite.trackId);
    const artistsList = favorites
      .filter((favorite) => favorite.artistId !== null)
      .map((favorite) => favorite.artistId);
    const albumsList = favorites
      .filter((favorite) => favorite.albumId !== null)
      .map((favorite) => favorite.albumId);

    const tracks = await this.prisma.tracks.findMany({
      where: {
        id: { in: tracksList },
      },
    });
    const artists = await this.prisma.artists.findMany({
      where: {
        id: { in: artistsList },
      },
    });
    const albums = await this.prisma.albums.findMany({
      where: {
        id: { in: albumsList },
      },
    });

    return {
      tracks: tracks,
      artists: artists,
      albums: albums,
    };
  }

  async createFavTrack(id: string) {
    // return 'This action adds a new favorite Track';
    //validate uuid
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`trackId ${id} is invalid (not uuid)`); //400
    }

    try {
      await this.prisma.favorites.create({
        data: { trackId: id },
      });
    } catch (error) {
      console.log('####favorites.service add track error:', error);
      throw new UnprocessableEntityException('Track not found.'); //422
    }
    return;
  }

  async createFavArtist(id: string) {
    // return 'This action adds a new favorite Artist';
    //validate uuid
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`artistId ${id} is invalid (not uuid)`);
    }

    // Check artist exists
    // const artist: Artist = db.artists.find((artist) => artist['id'] === id);
    // if (!artist) {
    //   throw new NotFoundException('Artist not found.');
    // }

    // Add to favorites

    try {
      await this.prisma.favorites.create({
        data: { artistId: id },
      });
    } catch (error) {
      console.log('####favorites.service add artist error:', error);
      throw new UnprocessableEntityException('Artist not found.'); //422
    }

    return;
  }

  async createFavAlbum(id: string) {
    // return 'This action adds a new favorite Album';
    //validate uuid
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`albumId ${id} is invalid (not uuid)`);
    }

    // Check album exists
    // const album: Album = db.albums.find((album) => album['id'] === id);
    // if (!album) {
    //   throw new NotFoundException('Album not found.');
    // }

    // Check already in favorites
    // if (db.favorites.albums.includes(id)) return;

    // Add to favorites
    // console.log('favorites.service album id:', id);
    // db.favorites.albums.push(id);
    try {
      await this.prisma.favorites.create({
        data: { albumId: id },
      });
    } catch (error) {
      console.log('####favorites.service add album error:', error);
      throw new UnprocessableEntityException('Album not found.'); //422
    }
    return;
  }

  async removeFavTrack(id: string) {
    // return `This action removes a #${id} favorite Track`;
    // db.favorites.tracks = db.favorites.tracks.filter((trackId) => {
    //   if (!trackId || trackId !== id || trackId === null) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // });

    // Remove
    try {
      await this.prisma.favorites.deleteMany({
        where: {
          trackId: { equals: id },
        },
      });
    } catch (error) {
      console.log('####favorites.service remove error:', error);
      // throw new NotFoundException('Favorite track not found.'); //404
    }
    // db.favorites.tracks = db.favorites.tracks.filter((trackId) => {
    //   return trackId !== id;
    // });
    return;
  }

  async removeFavArtist(id: string) {
    // return `This action removes a #${id} favorite Artist`;
    try {
      await this.prisma.favorites.deleteMany({
        where: {
          artistId: { equals: id },
        },
      });
    } catch (error) {
      console.log('####favorites.service remove error:', error);
      // throw new NotFoundException('Favorite track not found.'); //404
    }
    return;
  }

  async removeFavAlbum(id: string) {
    // return `This action removes a #${id} favorite Album`;
    try {
      await this.prisma.favorites.deleteMany({
        where: {
          albumId: { equals: id },
        },
      });
    } catch (error) {
      console.log('####favorites.service remove error:', error);
      // throw new NotFoundException('Favorite track not found.'); //404
    }
    return;
  }
}
