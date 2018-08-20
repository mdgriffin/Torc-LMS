package torclms.dto;

import torclms.model.Course;

import java.util.Date;

public class CourseDto {

    private int courseId;

    private String title;

    private String titleAudio;

    private String imageName;

    private Date dateCreated;

    public CourseDto () {}


    public CourseDto (Course course) {
        this.courseId = course.getCourseId();
        this.title = course.getTitle();
        this.titleAudio = course.getTitleAudio();
        this.imageName = course.getImageName();
        this.dateCreated = course.getDateCreated();
    }

    protected void onCreate() {
        dateCreated = new Date();
    }

    public int getCourseId() {
        return courseId;
    }

    public void setCourseId(int courseId) {
        this.courseId = courseId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitleAudio() {
        return titleAudio;
    }

    public void setTitleAudio(String titleAudio) {
        this.titleAudio = titleAudio;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }
}
