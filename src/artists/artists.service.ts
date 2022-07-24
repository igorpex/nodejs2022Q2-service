import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuid, validate, version } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}
  // private artists: Array<Artist> = [];
  async create(createArtistDto: CreateArtistDto) {
    // return 'This action adds a new artist';
    //check required fields and types
    const hasAllRequiredFields = createArtistDto.name && createArtistDto.grammy;
    const hasCorrectTypes =
      typeof createArtistDto.name === 'string' &&
      typeof createArtistDto.grammy === 'boolean';

    if (!hasAllRequiredFields || !hasCorrectTypes) {
      throw new BadRequestException(
        `request body does not contain required fields. name should be string, grammy should be boolean`,
      );
    }

    // create a artist with random id
    const newArtistData = {
      id: uuid(),
      ...createArtistDto,
    };
    const newArtist = await this.prisma.artists.create({
      data: newArtistData,
    });
    return newArtist;
  }

  async findAll() {
    const artists = await this.prisma.artists.findMany();
    return artists;
  }

  async findOne(id: string) {
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`artistId ${id} is invalid (not uuid)`);
    }

    // Check artist exists
    const artist = await this.prisma.artists.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    // return `This action updates a #${id} artist`;
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`artistId ${id} is invalid (not uuid)`); //400
    }

    //check required fields and types
    const hasCorrectTypes =
      typeof updateArtistDto.name === 'string' &&
      typeof updateArtistDto.grammy === 'boolean';

    if (!hasCorrectTypes) {
      throw new BadRequestException(
        `request body does not contain required fields. name should be string, grammy should be boolean`,
      );
    }
    const hasAllRequiredFields = updateArtistDto.name && updateArtistDto.grammy;
    if (!hasAllRequiredFields) {
    }

    // Check artist exists
    const artist = await this.prisma.artists.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist not found.');
    }

    //create updated artist
    const updatedArtistData = {
      id: id,
      ...updateArtistDto,
    };

    const updatedArtist = await this.prisma.artists.update({
      data: updatedArtistData,
      where: { id },
    });
    return updatedArtist;
  }

  async remove(id: string) {
    // return `This action removes a #${id} artist`;
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`artistId ${id} is invalid (not uuid)`); //400
    }
    // Remove
    try {
      await this.prisma.artists.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log('####artists.service remove error:', error);
      throw new NotFoundException('Artist not found.'); //404
    }

    // Null links in related entities

    // db.tracks = db.tracks.map((track) => {
    //   if (track.artistId === id) {
    //     track.artistId = null;
    //   }
    //   return track;
    // });

    // db.albums = db.tracks.map((album) => {
    //   if (album.artistId === id) {
    //     album.artistId = null;
    //   }
    //   return album;
    // });

    // Remove from favorites
    // db.favorites.artists = db.favorites.artists.filter(
    //   (artistId) => artistId !== id,
    // );

    // Remove artist itself
    // db.artists = db.artists.filter((artist) => artist['id'] !== id);
    // return;
  }
}
